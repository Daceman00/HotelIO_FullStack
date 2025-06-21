const Room = require('./../models/roomModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const multerS3 = require('multer-s3-transform');
const s3 = require('../config/s3'); // Import the shared S3 config

// New S3 storage configuration
const roomMulterStorage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: (req, file, cb) => cb(null, /^image/i.test(file.mimetype)),
    transforms: [
        {
            id: 'cover',
            shouldTransform: (req, file, cb) => cb(null, file.fieldname === 'imageCover'),
            transform: (req, file, cb) => {
                cb(null, sharp()
                    .resize(416, 256, {
                        fit: 'cover',
                        position: 'center',
                        withoutEnlargement: true
                    })
                    .webp({ quality: 80 })
                    .sharpen()
                );
            },
            key: (req, file, cb) => {
                const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const filename = `room-cover-${suffix}.webp`;
                cb(null, `rooms/${filename}`);
            }
        },
        {
            id: 'gallery',
            shouldTransform: (req, file, cb) => cb(null, file.fieldname === 'images'),
            transform: (req, file, cb) => {
                cb(null, sharp()
                    .resize(1600, 900, {
                        fit: 'cover',
                        position: 'center',
                        withoutEnlargement: true
                    })
                    .webp({ quality: 85 })
                    .sharpen()
                );
            },
            key: (req, file, cb) => {
                const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const filename = `room-gallery-${suffix}.webp`;
                cb(null, `rooms/${filename}`);
            }
        }
    ]
});


const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: roomMulterStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


// Middleware to handle uploads
exports.uploadRoomImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);

exports.processRoomImages = catchAsync(async (req, res, next) => {
    if (!req.files) return next();

    // Process cover image
    if (req.files.imageCover) {
        const coverFile = req.files.imageCover[0];
        req.body.imageCover = coverFile.transforms[0].location;
        req.body.imageCoverKey = coverFile.transforms[0].key;
    }

    // Process gallery images
    if (req.files.images) {
        req.body.images = [];
        req.body.imageKeys = [];

        req.files.images.forEach(file => {
            req.body.images.push(file.transforms[0].location);
            req.body.imageKeys.push(file.transforms[0].key);
        });
    }

    next();
});

exports.getRoomWithReviewsAndBookings = catchAsync(async (req, res, next) => {
    const room = await Room.findById(req.params.id)
        .populate({
            path: 'reviews',
            select: 'review rating user createdAt'
        })
        .populate({
            path: 'bookings',
            select: 'checkIn checkOut user price paid'
        })
        .populate('bookingsCount');

    if (!room) {
        return next(new AppError('No room found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            room
        }
    });
});

exports.getRoomWithActiveBookings = catchAsync(async (req, res, next) => {
    const room = await Room.findById(req.params.id)
        .populate({
            path: 'bookings',
            match: {
                $or: [
                    { checkIn: { $lte: new Date() }, checkOut: { $gte: new Date() } }, // Currently running bookings
                    { checkIn: { $gte: new Date() } } // Future bookings
                ]
            },
            select: 'checkIn checkOut user price paid'
        })
        .populate('bookingsCount');

    if (!room) {
        return next(new AppError('No room found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            room
        }
    });
});

exports.getAllRooms = factory.getAll(Room, "bookingsCount");
exports.getRoom = factory.getOne(Room);
exports.createRoom = factory.createOne(Room);
exports.updateRoom = factory.updateOne(Room);

exports.createRoomWithImages = [
    exports.uploadRoomImages,
    exports.processRoomImages,
    exports.createRoom
];

exports.updateRoomWithImages = [
    exports.uploadRoomImages,
    exports.processRoomImages,
    exports.updateRoom
];

exports.deleteRoom = catchAsync(async (req, res, next) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
        return next(new AppError('No room found with that ID', 404));
    }

    // The following line will trigger the pre('deleteOne') middleware in roomModel.js,
    // which deletes bookings and removes images from S3.
    await room.deleteOne();

    res.status(204).json({
        status: 'success',
        data: null
    });
});