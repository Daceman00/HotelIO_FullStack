const User = require('./../models/userModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
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

const multerStorage = multer.memoryStorage();

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
exports.uploadProfilePhoto = upload.single('profilePhoto');

// Middleware to resize profile photo
exports.resizeProfilePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next(); // If no file is uploaded, proceed to the next middleware

    // Generate filename and resize photo
    req.body.profilePhoto = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500) // Resize to a square image
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.body.profilePhoto}`);

    next();
});
exports.getMyAccount = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

exports.updateMyAccount = catchAsync(async (req, res, next) => {
    // Create error if user POSTs password
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400))
    }

    // Filter out fields that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'email', 'name')

    if (req.body.name || req.body.email) {
        return next(new AppError('You are not allowed to change your name or email', 400))
    }

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    })
})


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
    let filter = {};

    const total = await User.countDocuments();

    const features = new APIFeatures(User.find(filter), req.query)
        .filter() // Apply base filters first
        .search(['name', 'email', 'role']) // Then add search conditions
        .applyFilters()
        .sort()
        .limitFields()
        .paginate();

    const users = await features.query;

    res.status(200).json({
        status: 'success',
        results: users.length,
        total,
        data: { data: users }
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

