const Booking = require('./../models/bookingModel');
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

exports.createBooking = catchAsync(async (req, res, next) => {
    console.log('Creating booking with dates:', req.body.checkIn, req.body.checkOut);
    await factory.createOne(Booking)(req, res, next);
});

exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);