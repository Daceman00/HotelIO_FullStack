const { default: mongoose } = require("mongoose");
const AppError = require("../utils/appError");

const bookingSchema = new mongoose.Schema({
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
        required: [true, "Price is required"],
        default: 0 // Add a default value for price
    },
    paid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: [true, "Booking must be associated with a room"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "Booking must have a user"]
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

bookingSchema.virtual('numOfNights').get(function () {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    return Math.ceil(Math.abs((this.checkOut - this.checkIn) / oneDay));
});

bookingSchema.methods.parseDateTime = function (dateTimeString) {
    return new Date(dateTimeString);
};

// Pre-save middleware to parse date-time strings
bookingSchema.pre('save', function (next) {
    if (typeof this.checkIn === 'string') {
        this.checkIn = this.parseDateTime(this.checkIn);
    }
    if (typeof this.checkOut === 'string') {
        this.checkOut = this.parseDateTime(this.checkOut);
    }
    if (typeof this.createdAt === 'string') {
        this.createdAt = this.parseDateTime(this.createdAt);
    }
    next();
});

// Pre-save middleware to check for past dates, overlapping dates, and calculate price
bookingSchema.pre('save', async function (next) {
    const currentDate = new Date();
    if (this.checkIn < currentDate || this.checkOut < currentDate) {
        return next(new AppError('Booking dates cannot be in the past.'));
    }

    // Check if checkIn date is after checkOut date
    if (this.checkIn >= this.checkOut) {
        return next(new AppError('Check-out date must be at least one day after check-in date.'));
    }

    // Set default check-in and check-out times
    this.checkIn.setHours(14, 0, 0, 0); // Set default check-in time to 14:00
    this.checkOut.setHours(11, 0, 0, 0); // Set default check-out time to 11:00

    // Skip overlapping booking check if only the 'paid' property is being updated
    if (this.isModified('paid') && !this.isModified('checkIn') && !this.isModified('checkOut')) {
        return next();
    }

    const overlappingBooking = await this.constructor.findOne({
        room: this.room,
        _id: { $ne: this._id }, // Exclude the current booking from the check
        $or: [
            { checkIn: { $lt: this.checkOut }, checkOut: { $gt: this.checkIn } }
        ]
    });

    if (overlappingBooking) {
        return next(new AppError('Booking dates overlap with an existing booking.'));
    }

    // Calculate the price based on the number of nights and round it
    const room = await mongoose.model('Room').findById(this.room);
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const numberOfNights = Math.ceil((this.checkOut - this.checkIn) / oneDay);
    this.price = numberOfNights * room.price;

    next();
});

// Pre-save middleware to set the paidAt field
bookingSchema.pre('save', function (next) {
    if (this.isModified('paid') && this.paid) {
        this.paidAt = new Date();
    }
    next();
});

bookingSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email photo'
    });
    this.populate({
        path: 'room',
        select: 'roomNumber price'
    })
    next();
});

bookingSchema.index({ room: 1, user: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

