const mongoose = require("mongoose");
const AppError = require('../utils/appError');
const roomController = require('./../controllers/roomController')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!'],
        maxlength: [500, 'Review must be less than or equal to 500 characters']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "Review must have a user"]
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: [true, "Review must be associated with a room"]
    },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    this.populate({
        path: 'room',
        select: 'roomNumber price'
    })
    next();
});
reviewSchema.post('save', async function () {
    await roomController.calculateAverageRating(this.room)
});

reviewSchema.post('remove', async function () {
    await roomController.calculateAverageRating(this.room)
});

reviewSchema.index({ room: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;