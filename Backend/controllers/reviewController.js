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
    const reviews = await Review.find({ user: req.user.id });

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

});

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find()
        .populate({
            path: 'user',
            select: 'username email'
        });

    // Filter out reviews where user was deleted
    const validReviews = reviews.filter(review => review.user !== null);

    res.status(200).json({
        status: 'success',
        results: validReviews.length,
        data: {
            data: validReviews
        }
    });
});


exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);