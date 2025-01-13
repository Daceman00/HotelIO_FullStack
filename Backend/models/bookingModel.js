const { default: mongoose } = require("mongoose");
const AppError = require("../utils/appError");

const bookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: [true, "Booking must be associated with a room"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "Booking must have a user"]
    },
    checkIn: {
        type: Date,
        required: [true, "Check-in date is required"]
    },
    checkOut: {
        type: Date,
        required: [true, "Check-out date is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    paid: {
        type: Boolean,
        default: false
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

bookingSchema.index({ room: 1, user: 1 }, { unique: true });

// Pre-save middleware to check for past dates
bookingSchema.pre('save', function (next) {
    const currentDate = new Date();
    if (this.checkIn < currentDate || this.checkOut < currentDate) {
        return next(new AppError('Booking dates cannot be in the past.'));
    }
    next();
});

// Instance method to check if booking dates overlap with another booking
bookingSchema.methods.isOverlapping = function (checkIn, checkOut) {
    return (
        (this.checkIn <= checkOut && this.checkOut >= checkIn) || // Overlapping dates
        (this.checkIn.getTime() === checkIn.getTime() && this.checkOut.getTime() === checkOut.getTime()) // Exact same dates
    );
};
// Pre-save middleware to check for overlapping dates
bookingSchema.pre('save', async function (next) {
    // Check if checkIn date is after checkOut date
    if (this.checkIn > this.checkOut) {
        return next(new AppError('Check-in date cannot be after check-out date.'));
    }

    const overlappingBooking = await this.constructor.findOne({
        room: this.room,
        $or: [
            { checkIn: { $lt: this.checkOut }, checkOut: { $gt: this.checkIn } }
        ]
    });

    if (overlappingBooking) {
        return next(new AppError('Booking dates overlap with an existing booking.'));
    }

    next();
});

bookingSchema.pre('save', function (next) {
    this.checkIn = this.checkIn.toLocaleDateString();
    this.checkOut = this.checkOut.toLocaleDateString();
    next();
});

bookingSchema.pre(/^find/, function (next) {
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


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;