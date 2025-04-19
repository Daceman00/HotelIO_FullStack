const Room = require('./../models/roomModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

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
    if (!req.files) return next()

    if (req.files.imageCover) {
        // Enable experimental SIMD optimizations for faster processing
        sharp.concurrency(1);
        sharp.simd(true);

        // 1) Process cover image
        const coverImage = req.files.imageCover[0];
        req.body.imageCover = `room-${req.params.id}-${Date.now()}-cover.webp`;

        await sharp(coverImage.buffer)
            .resize({
                width: 320,
                height: 360,
                fit: 'inside',        // Maintain aspect ratio without cropping
                withoutEnlargement: true, // Don't enlarge smaller images
                kernel: sharp.kernel.lanczos3 // Higher quality interpolation
            })
            .webp({
                quality: 85,         // Optimal quality/size balance
                alphaQuality: 90,
                lossless: false,
                nearLossless: true
            })
            .sharpen({               // Add subtle sharpening
                sigma: 0.5,
                m1: 1,
                m2: 3
            })
            .withMetadata()          // Preserve EXIF data
            .toFile(`public/img/rooms/${req.body.imageCover}`);
    }



    // 2) Process additional images
    if (req.files.images) {
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (file, i) => {
                const filename = `room-${req.params.id}-${Date.now()}-${i + 1}.webp`;

                await sharp(file.buffer)
                    .resize({
                        width: 2000,
                        height: 1333,
                        fit: 'inside',
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
exports.deleteRoom = factory.deleteOne(Room);