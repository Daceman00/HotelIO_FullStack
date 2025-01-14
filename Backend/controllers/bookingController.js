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

exports.calculateBookingPrice = catchAsync(async (req, res, next) => {
    const room = await Room.findById(req.body.room);
    if (!room) {
        return next(new AppError('Room not found', 404));
    }

    const checkInDate = new Date(req.body.checkIn);
    const checkOutDate = new Date(req.body.checkOut);
    const numberOfDays = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    req.body.price = numberOfDays * room.price;
    next();
});

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
        })
    }

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings
        }
    });
})

exports.createBooking = factory.createOne(Booking)
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);