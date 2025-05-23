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

exports.getTopReviewers = catchAsync(async (req, res, next) => {
    const [totalsStats] = await Review.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        },
        {
            $project: {
                total: 1,
                avgRating: { $round: ['$avgRating', 1] }
            }
        }
    ]);

    const topReviewers = await Review.aggregate([
        {
            $group: {
                _id: '$user',
                totalReviews: { $sum: 1 },
                averageRating: { $avg: '$rating' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $unwind: '$userDetails'
        },
        {
            $project: {
                _id: 1,
                name: '$userDetails.name',
                email: '$userDetails.email',
                totalReviews: 1,
                averageRating: { $round: ['$averageRating', 1] }
            }
        },
        {
            $sort: { totalReviews: -1 }
        },
        {
            $limit: 10
        }
    ]);

    res.status(200).json({
        status: 'success',
        totalReviews: totalsStats.total || 0,
        averageRating: totalsStats.avgRating || 0,
        data: {
            topReviewers
        }
    });
});

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);