const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getPublishableKey = catchAsync(async (req, res, next) => {
    console.log(process.env.STRIPE_PUBLISHABLE_KEY);
    res.status(200).json({
        status: 'success',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
})

exports.createPaymentIntent = catchAsync(async (req, res, next) => {
    const { bookingId } = req.body;

    // Validate bookingId
    if (!bookingId) {
        return next(new AppError('Please provide a booking ID', 400));
    }

    // Get booking details
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404));
    }

    // Verify booking belongs to current user
    if (booking.user.id !== req.user.id) {
        return next(new AppError('You can only pay for your own bookings', 403));
    }

    // Check if already paid
    if (booking.paid) {
        return next(new AppError('This booking is already paid', 400));
    }

    // Create or retrieve Stripe customer
    let customer;
    const email = req.user.email;
    const existingCustomers = await stripe.customers.list({ email });

    if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
    } else {
        customer = await stripe.customers.create({
            email: email,
            name: req.user.name
        });
    }

    // Create payment intent with customer
    const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.price,
        currency: 'usd',
        customer: customer.id,
        metadata: {
            bookingId: booking._id.toString(),
            userId: req.user._id.toString()
        }
    });

    // Update booking with payment intent ID
    booking.paymentIntentId = paymentIntent.id;
    await booking.save();

    res.status(200).json({
        status: 'success',
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
    });
});

exports.confirmPayment = catchAsync(async (req, res, next) => {
    const { paymentIntentId } = req.body;

    const booking = await Booking.findOne({ paymentIntentId }).exec();

    if (!booking) {
        return next(new AppError('No booking found with that payment intent', 404));
    }

    // Verify payment status with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Handle different payment statuses
    switch (paymentIntent.status) {
        case 'succeeded':
            booking.paymentStatus = 'paid';
            booking.paid = true;
            booking.paidAt = new Date();
            break;
        case 'processing':
            booking.paymentStatus = 'processing';
            break;
        case 'requires_payment_method':
        case 'requires_confirmation':
        case 'requires_action':
        case 'requires_capture':
            // Instead of failing, return the status to client
            res.status(200).json({
                status: 'pending',
                message: 'Payment requires additional action',
                paymentStatus: paymentIntent.status,
                clientSecret: paymentIntent.client_secret,
                requiresAction: true
            });
            return; // Exit early
        case 'canceled':
            booking.paymentStatus = 'failed';
            return next(new AppError('Payment was cancelled', 400));
        default:
            booking.paymentStatus = 'pending';
    }

    await booking.save();

    res.status(200).json({
        status: 'success',
        paymentStatus: paymentIntent.status,
        requiresAction: false,
        data: booking
    });
});

exports.processPaymentWithDetails = catchAsync(async (req, res, next) => {
    const { paymentIntentId, paymentMethod } = req.body;

    // Get payment intent first to get customer ID
    const existingIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethod, {
        customer: existingIntent.customer
    });

    // Update customer's default payment method
    await stripe.customers.update(existingIntent.customer, {
        invoice_settings: {
            default_payment_method: paymentMethod
        }
    });

    // Confirm the payment
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethod
    });

    // Find and update booking
    const booking = await Booking.findOne({ paymentIntentId });
    booking.paymentStatus = paymentIntent.status === 'succeeded' ? 'paid' : 'pending';
    booking.paid = paymentIntent.status === 'succeeded';
    if (booking.paid) booking.paidAt = new Date();
    await booking.save();

    res.status(200).json({
        status: 'success',
        paymentStatus: paymentIntent.status,
        data: booking
    });
});