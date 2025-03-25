const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

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
    let filter = { room: req.params.id };

    const features = new APIFeatures(Review.find(filter), req.query)
        .filter()
        .search(['review', 'rating'])
        .applyFilters()
        .sort()
        .limitFields()
        .paginate();

    // Clone the query to get the filter without pagination/sorting/field limits
    const countQuery = Review.find(features.query.getFilter());
    const total = await countQuery.countDocuments();

    const reviews = await features.query;

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        total,
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