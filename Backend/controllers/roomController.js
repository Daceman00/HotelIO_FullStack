const Room = require('./../models/roomModel')
const Review = require('../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const { default: mongoose } = require('mongoose');

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
    if (!req.files.imageCover || !req.files.images) return next();

    // 1) Process cover image
    req.body.imageCover = `room-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/rooms/${req.body.imageCover}`);

    // 2) Process additional images
    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `room-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/rooms/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
});

exports.getRoomWithReviews = catchAsync(async (req, res, next) => {
    const popOptions = {
        path: 'reviews',  // Virtual field to populate
        select: 'review rating user createdAt'  // Specify fields to include from reviews
    };

    return factory.getOne(Room, popOptions)(req, res, next)

});


exports.calculateAverageRating = async (roomId) => {
    // Ensure roomId is valid
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        throw new Error("Invalid Room ID");
    }

    const stats = await Review.aggregate([
        { $match: { room: mongoose.Types.ObjectId(roomId) } },
        {
            $group: {
                _id: '$room',
                averageRating: { $avg: '$rating' },
                numRatings: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Room.findByIdAndUpdate(roomId, {
            averageRating: stats[0].averageRating,
            numRatings: stats[0].numRatings
        });
    } else {
        await Room.findByIdAndUpdate(roomId, {
            averageRating: 0,
            numRatings: 0
        });
    }
};




exports.getAllRooms = factory.getAll(Room)
exports.getRoom = factory.getOne(Room,)
exports.createRoom = factory.createOne(Room)
exports.updateRoom = factory.updateOne(Room)
exports.deleteRoom = factory.deleteOne(Room)