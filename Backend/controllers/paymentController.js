const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');

exports.createPaymentIntent = catchAsync(async (req, res, next) => {
    const { bookingId } = req.body;

    // Get booking details
    const booking = await Booking.findById(bookingId);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.price * 100, // Stripe expects amounts in cents
        currency: 'usd',
        metadata: {
            bookingId: booking._id.toString(),
            userId: req.user._id.toString()
        }
    });

    // Update booking with payment intent
    booking.paymentIntentId = paymentIntent.id;
    booking.paymentStatus = 'processing';
    await booking.save();

    res.status(200).json({
        status: 'success',
        clientSecret: paymentIntent.client_secret
    });
});

exports.confirmPayment = catchAsync(async (req, res, next) => {
    const { paymentIntentId } = req.body;

    const booking = await Booking.findOne({ paymentIntentId });

    booking.paymentStatus = 'paid';
    booking.paid = true;
    booking.paidAt = new Date();
    await booking.save();

    res.status(200).json({
        status: 'success',
        data: booking
    });
});