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
const { deleteS3Files } = require('../utils/s3Utils');

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
                    .resize(1200, 738, {  // Increased source dimensions
                        fit: 'cover',
                        position: sharp.strategy.entropy,  // Better content-aware cropping
                        withoutEnlargement: true
                    })
                    .webp({
                        quality: 90,
                        alphaQuality: 90,
                        effort: 6  // Better compression
                    })
                    .sharpen({
                        sigma: 0.6,
                        flat: 1.0,
                        jagged: 1.0
                    })
                );
            },
            key: (req, file, cb) => {
                const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                cb(null, `rooms/room-cover-${suffix}.webp`);
            }
        },
        {
            id: 'gallery',
            shouldTransform: (req, file, cb) => cb(null, file.fieldname === 'images'),
            transform: (req, file, cb) => {
                cb(null, sharp()
                    .resize(1920, 1080, {  // Increased source dimensions
                        fit: 'inside',
                        withoutEnlargement: true,  // Prevent quality-destroying upscaling
                        fastShrinkOnLoad: false   // Better quality reduction
                    })
                    .webp({
                        quality: 85,
                        alphaQuality: 90,
                        effort: 6  // Better compression
                    })
                    .sharpen({
                        sigma: 0.8,
                        flat: 1.0,
                        jagged: 1.0
                    })
                    .withMetadata()  // Preserve color profiles
                );
            },
            key: (req, file, cb) => {
                const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                cb(null, `rooms/room-gallery-${suffix}.webp`);
            }
        }
    ]
});

// Improved file filter
const multerFilter = (req, file, cb) => {
    if (/^image\/(jpe?g|png|webp|avif)/i.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Unsupported image format! Please upload JPEG, PNG, or WEBP images.', 400), false);
    }
};

const upload = multer({
    storage: roomMulterStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 12 * 1024 * 1024 } // Increased to 12MB
});

// Middleware remains the same
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

    // Process gallery images (exclude any accidental cover images)
    if (req.files.images) {
        req.body.images = [];
        req.body.imageKeys = [];

        req.files.images
            .filter(file => file.fieldname === 'images')
            .forEach(file => {
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

exports.deleteRoomImages = catchAsync(async (req, res, next) => {
    const roomId = req.params.id;
    const { imagesToDelete } = req.body;

    // Validate input
    if (!roomId || !imagesToDelete || !Array.isArray(imagesToDelete) || imagesToDelete.length === 0) {
        return next(new AppError('Invalid request parameters', 400));
    }

    // Find room and verify existence
    const room = await Room.findById(roomId);
    if (!room) {
        return next(new AppError('Room not found', 404));
    }

    // Prepare keys for deletion
    const keysToDelete = [];

    // Process cover image
    if (imagesToDelete.includes('cover') && room.imageCoverKey) {
        keysToDelete.push(room.imageCoverKey);
        room.imageCover = undefined;
        room.imageCoverKey = undefined;
    }

    // Process gallery images
    const galleryKeysToDelete = imagesToDelete
        .filter(key => key.startsWith('gallery-'))
        .map(key => key.replace('gallery-', ''));

    if (galleryKeysToDelete.length > 0) {
        const newImages = [];
        const newImageKeys = [];

        room.images.forEach((url, index) => {
            const key = room.imageKeys[index];
            if (!galleryKeysToDelete.includes(key)) {
                newImages.push(url);
                newImageKeys.push(key);
            } else {
                keysToDelete.push(key);
            }
        });

        room.images = newImages;
        room.imageKeys = newImageKeys;
    }

    // Delete from S3
    if (keysToDelete.length > 0) {
        await deleteS3Files(keysToDelete);
    }

    // Save updated room document
    await room.save();

    res.status(204).json({
        status: 'success',
        data: null
    });
});