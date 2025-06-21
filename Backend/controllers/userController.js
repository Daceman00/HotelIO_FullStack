const User = require('./../models/userModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const multerS3 = require('multer-s3-transform');
const s3 = require('../config/s3'); // Import the shared S3 config

const APIFeatures = require('../utils/apiFeatures');
const mongoose = require("mongoose");
const Booking = require('../models/bookingModel');

const filterObj = (obj, ...unallowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (!unallowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

// Replace the multerStorage configuration
const multerStorage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read', // Set the ACL to public-read for profile photos
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: function (req, file, cb) {
        cb(null, /^image/i.test(file.mimetype))
    },
    transforms: [{
        id: 'original',
        transform: function (req, file, cb) {
            cb(null, sharp()
                .resize(500, 500)
                .jpeg({ quality: 90 }))
        },
        key: function (req, file, cb) {
            const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
            cb(null, `users/${filename}`);
        }
    }]
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

// Middleware to handle profile photo upload
exports.uploadProfilePhoto = upload.single('photo');

// Middleware to resize profile photo
exports.resizeProfilePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    // Get the file URL from S3
    req.body.photo = req.file.transforms[0].location;

    // Update user's photo in database
    await User.findByIdAndUpdate(req.user.id, { photo: req.body.photo });

    next();
});

exports.getMyAccount = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

exports.updateMyAccount = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates.', 400));
    }

    // Only allow 'profilePhoto' to be updated
    const filteredBody = filterObj(req.body, 'photo');

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: { user: updatedUser }
    });
});


exports.deleteMyAccount = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.user.id);

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getUserWithReviews = catchAsync(async (req, res, next) => {
    const popOptions = {
        path: 'reviews',  // Virtual field to populate
        select: 'review rating room createdAt'  // Specify fields to include from reviews
    };

    return factory.getOne(User, popOptions)(req, res, next)
})

exports.getUserWithBookings = catchAsync(async (req, res, next) => {
    const popOptions = {
        path: 'bookings',  // Virtual field to populate
        select: 'room user checkIn checkOut createdAt'  // Specify fields to include from bookings
    }

    return factory.getOne(User, popOptions)(req, res, next)
})

exports.getAllUsers = catchAsync(async (req, res, next) => {
    let filters = {};

    // Handle search for name, email, and role fields
    if (req.query.search) {
        const searchTerm = req.query.search.trim();
        if (searchTerm) {
            filters.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { role: { $regex: searchTerm, $options: 'i' } }
            ];
        }
    }

    // Initialize APIFeatures and apply filters
    const features = new APIFeatures(User.find(), req.query)
        .mergeFilters(filters)
        .filter()
        .applyFilters();

    // Get total count before pagination
    const total = await User.countDocuments(features.filters);

    // Apply remaining operations
    features
        .sort()
        .limitFields()
        .paginate();

    // Execute query
    const users = await features.query;
    // Calculate pagination details
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
        status: 'success',
        results: users.length,
        total,
        totalPages,
        currentPage: page,
        data: {
            data: users
        }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findByIdAndDelete(req.params.id).session(session);

        if (!user) {
            return next(new AppError('No user found with that ID', 404));
        }

        // Delete associated reviews in transaction
        await Review.deleteMany({ user: user._id }).session(session);
        await Booking.deleteMany({ user: user._id }).session(session);

        // Delete user photo from S3 bucket if it is a URL
        if (user.photo && user.photo.startsWith('http')) {
            try {
                const parsedUrl = new URL(user.photo);
                const key = decodeURIComponent(parsedUrl.pathname.substring(1)); // Remove leading slash

                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key
                };

                await s3.deleteObject(params).promise();
                console.log(`Deleted user photo from S3: ${key}`);
            } catch (err) {
                console.error('Failed to delete user photo from S3:', err);
                // Optionally handle or log error
            }
        }

        await session.commitTransaction();

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
});

exports.getUser = factory.getOne(User)
exports.updateUser = factory.updateOne(User)
exports.createUser = factory.createOne(User)

