const Room = require('./../models/roomModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Multer configuration
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

// Middleware to handle image uploads
exports.uploadRoomImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }, // Adjust the maxCount as per your requirement
]);

// Middleware to resize images 
exports.resizeRoomImages = catchAsync(async (req, res, next) => {
    if (!req.files) return next();

    // Enable experimental SIMD optimizations for faster processing
    sharp.concurrency(1);
    sharp.simd(true);

    if (req.files.imageCover) {
        // 1) Process cover image
        const coverImage = req.files.imageCover[0];
        req.body.imageCover = `room-${req.params.id}-${Date.now()}-cover.webp`;

        /* 
         * COVER IMAGE DIMENSIONS:
         * - Width: 1200px (good balance for hero image display)
         * - Height: 800px (16:9 aspect ratio)
         * - This creates a consistent landscape orientation that works well
         *   in the hero section while maintaining a reasonable file size
         */
        await sharp(coverImage.buffer)
            .resize({
                width: 400,
                height: 400,
                fit: 'cover',         // Square crop
                position: 'center',   // Focus on the center of the image
                withoutEnlargement: true,
                kernel: sharp.kernel.lanczos3
            })
            .webp({
                quality: 80,          // Slightly lower quality for thumbnails
                alphaQuality: 80,
                lossless: false,
                nearLossless: false   // Less aggressive optimization for thumbnails
            })
            .sharpen({
                sigma: 0.5,
                m1: 1,
                m2: 2
            })
            .withMetadata()
            .toFile(`public/img/rooms/${req.body.imageCover}`);
    }

    // 2) Process additional images
    if (req.files.images) {
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (file, i) => {
                const filename = `room-${req.params.id}-${Date.now()}-${i + 1}.webp`;

                /* 
                 * GALLERY IMAGE DIMENSIONS:
                 * - Width: 1600px (provides good detail on larger screens)
                 * - Height: 900px (16:9 aspect ratio)
                 * - These dimensions work well with the Swiper gallery in the
                 *   modernized UI while maintaining consistent proportions
                 */
                await sharp(file.buffer)
                    .resize({
                        width: 1600,
                        height: 900,
                        fit: 'cover',        // Ensures consistent dimensions
                        position: 'center',  // Focus on the center of the image
                        withoutEnlargement: true,
                        kernel: sharp.kernel.lanczos3
                    })
                    .webp({
                        quality: 85,
                        alphaQuality: 90,
                        lossless: false,
                        nearLossless: true
                    })
                    .sharpen({
                        sigma: 0.5,
                        m1: 1,
                        m2: 3
                    })
                    .withMetadata()
                    .toFile(`public/img/rooms/${filename}`);

                req.body.images.push(filename);
            })
        );
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

exports.deleteRoom = catchAsync(async (req, res, next) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
        return next(new AppError('No room found with that ID', 404));
    }

    // Delete images from public folder
    if (room.imageCover) {
        const coverImagePath = path.join(__dirname, `../public/img/rooms/${room.imageCover}`);
        try {
            await fs.unlink(coverImagePath);
        } catch (err) {
            console.log('Error deleting cover image:', err);
        }
    }

    if (room.images && room.images.length > 0) {
        const deleteImagePromises = room.images.map(async (image) => {
            const imagePath = path.join(__dirname, `../public/img/rooms/${image}`);
            try {
                await fs.unlink(imagePath);
            } catch (err) {
                console.log('Error deleting image:', err);
            }
        });
        await Promise.all(deleteImagePromises);
    }

    // Delete all bookings associated with this room
    await Booking.deleteMany({ room: req.params.id });

    // Delete the room
    await room.deleteOne();

    res.status(204).json({
        status: 'success',
        data: null
    });
});