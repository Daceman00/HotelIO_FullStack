const Booking = require('./../models/bookingModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.checkReviewEligibility = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const roomId = req.body.room || req.params.roomId;

    console.log(`Checking review eligibility for user: ${userId}, room: ${roomId}`);

    const booking = await Booking.findOne({
        user: userId,
        room: roomId,
        checkIn: { $lte: new Date() }, // Check if checkIn date is in the past or today
        checkOut: { $lt: new Date() } // Check if checkOut date is in the past
    });

    if (!booking) {
        return next(new AppError('You can only leave a review after completing a stay.', 403));
    }

    next();
});