const Room = require('./../models/roomModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const multerS3 = require('multer-s3-transform');
const s3 = require('../config/s3'); // Import the shared S3 config
const { deleteS3Files } = require('../utils/s3Utils')

// Cover Image Storage (only cover transform)
const coverStorage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: (req, file, cb) => cb(null, /^image/i.test(file.mimetype)),
    transforms: [{
        id: 'cover',
        transform: (req, file, cb) => {
            cb(null, sharp()
                .resize(1200, 738, {
                    fit: 'cover',
                    position: sharp.strategy.entropy,
                    withoutEnlargement: true
                })
                .webp({ quality: 90, alphaQuality: 90, effort: 6 })
                .sharpen({ sigma: 0.6, flat: 1.0, jagged: 1.0 })
            );
        },
        key: (req, file, cb) => {
            const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `rooms/room-cover-${suffix}.webp`);
        }
    }]
});

// Gallery Images Storage (only gallery transform)
const galleryStorage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: (req, file, cb) => cb(null, /^image/i.test(file.mimetype)),
    transforms: [{
        id: 'gallery',
        transform: (req, file, cb) => {
            cb(null, sharp()
                .resize(1920, 1080, {
                    fit: 'inside',
                    withoutEnlargement: true,
                    fastShrinkOnLoad: false
                })
                .webp({ quality: 85, alphaQuality: 90, effort: 6 })
                .sharpen({ sigma: 0.8, flat: 1.0, jagged: 1.0 })
                .withMetadata()
            );
        },
        key: (req, file, cb) => {
            const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `rooms/room-gallery-${suffix}.webp`);
        }
    }]
});

// Improved file filter
const multerFilter = (req, file, cb) => {
    if (/^image\/(jpe?g|png|webp|avif)/i.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Unsupported image format! Please upload JPEG, PNG, or WEBP images.', 400), false);
    }
};

// Cover image upload (single file)
exports.uploadRoomCover = multer({
    storage: coverStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 12 * 1024 * 1024 }
}).single('imageCover'); // Field name: imageCover

// Gallery images upload (multiple files)
exports.uploadRoomGallery = multer({
    storage: galleryStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 12 * 1024 * 1024 }
}).array('images', 5); // Field name: images, max 5 files

// Process cover image
exports.processRoomCover = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.body.imageCover = req.file.transforms[0].location;
    req.body.imageCoverKey = req.file.transforms[0].key;

    next();
});

// Process gallery images
exports.processRoomGallery = catchAsync(async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();

    req.body.images = req.files.map(file => file.transforms[0].location);
    req.body.imageKeys = req.files.map(file => file.transforms[0].key);

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

/* exports.deleteRoomImages = catchAsync(async (req, res, next) => {
    
    try {
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
        const galleryKeysToDelete = imagesToDelete.filter(key => key !== 'cover');
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

        // Debug logging

        // Delete from S3 (try both with and without leading slash for legacy files)
        if (keysToDelete.length > 0) {
            const allKeys = [
                ...keysToDelete,
                ...keysToDelete.map(k => k.startsWith('/') ? k : '/' + k)
            ];
            await deleteS3Files(allKeys);
        }

        // Save updated room document
        await room.save();

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.error("Deletion error:", err);
        return next(new AppError('Deletion failed', 500));
    }
}); */

exports.updateRoomImages = catchAsync(async (req, res, next) => {
    const updateData = { ...req.body };
    const updateOps = {};

    // Handle gallery images - APPEND using $push
    if (req.body.images && req.body.imageKeys) {
        updateOps.$push = {
            images: { $each: req.body.images },
            imageKeys: { $each: req.body.imageKeys }
        };

        // Remove properties to avoid conflicts
        delete updateData.images;
        delete updateData.imageKeys;
    }

    // Handle cover image update
    if (updateData.imageCover) {
        updateOps.$set = {
            imageCover: updateData.imageCover,
            imageCoverKey: updateData.imageCoverKey
        };
        delete updateData.imageCover;
        delete updateData.imageCoverKey;
    }

    // Handle other updates (name, description, etc.)
    if (Object.keys(updateData).length > 0) {
        updateOps.$set = {
            ...updateOps.$set,
            ...updateData
        };
    }

    // If no update operations, skip DB call
    if (Object.keys(updateOps).length === 0) {
        const room = await Room.findById(req.params.id);
        if (!room) return next(new AppError('Room not found', 404));
        return res.status(200).json({ status: 'success', data: { room } });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        updateOps,
        { new: true, runValidators: true, context: 'query' }
    );

    if (!updatedRoom) return next(new AppError('Room not found', 404));

    res.status(200).json({
        status: 'success',
        data: { room: updatedRoom }
    });
});

exports.getAllRooms = factory.getAll(Room, "bookingsCount");
exports.getRoom = factory.getOne(Room);
exports.createRoom = factory.createOne(Room);
exports.updateRoom = factory.updateOne(Room);
