const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.setRoomUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.room) req.body.room = req.params.roomId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.getReviewsByUser = catchAsync(async (req, res, next) => {
    const reviews = await Review.find({ user: req.params.id }); // Find all reviews by user ID

    if (!reviews || reviews.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No reviews found for this user'
        });
    }

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
    next()
});

exports.getReviewsByRoom = catchAsync(async (req, res, next) => {
    const reviews = await Review.find({ room: req.params.id }); // Find all reviews by room ID

    if (!reviews || reviews.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No reviews found for this room'
        });
    }

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
    next()
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);