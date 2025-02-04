const Booking = require('./../models/bookingModel');
const Room = require('./../models/roomModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.setRoomUserIds = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    if (!req.body.room) req.body.room = req.params.roomId;
    next();
};

exports.getBookingsByUser = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.params.id });

    if (!bookings || bookings.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No bookings found for this user'
        });
    }

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings
        }
    });
    next();
});

exports.getBookingsByRoom = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({ room: req.params.id });
    if (!bookings || bookings.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No bookings found for this room'
        });
    }

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings
        }
    });
});

exports.markBookingAsPaid = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id).populate('user');

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404));
    }

    // Check if the user making the request is the one who booked the room
    if (booking.user._id.toString() !== req.user.id.toString()) {
        return next(new AppError('You do not have permission to mark this booking as paid', 403));
    }

    booking.paid = true;
    await booking.save();

    res.status(200).json({
        status: 'success',
        data: {
            booking
        }
    });
});

exports.createBooking = catchAsync(async (req, res, next) => {
    const newBooking = await Booking.create(req.body);
    const populatedBooking = await Booking.findById(newBooking._id).populate('user').populate('room');

    res.status(201).json({
        status: 'success',
        data: {
            booking: populatedBooking
        }
    });
});

exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);