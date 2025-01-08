const mongoose = require("mongoose");
const AppError = require('../utils/appError');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
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


reviewSchema.index({ room: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })

})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;