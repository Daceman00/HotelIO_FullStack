const mongoose = require("mongoose");
const AppError = require('./../utils/appError');

const roomSchema = mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, "Room number is required"],
        unique: true
    },

    roomType: {
        type: String,
        required: [true, "Room type is required"],
        enum: ["single", "double", "suite", "deluxe"]
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
    },

    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available'
    },

    description: {
        type: String,
        required: [true, "Description is required"]
    },

    imageCover: {
        type: String,

    },
    images: [String],


    features: {
        type: [String],
        default: []
    },

    maxGuests: {
        type: Number,
        required: [true, "Max guests is required"],
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
})

// Room number sanitize
roomSchema.pre('save', function (next) {
    this.roomNumber = this.roomNumber.trim().toUpperCase();
    next()
})

// Price and type validation
roomSchema.pre('save', function (next) {
    if (this.price <= 0) {
        return next(new AppError("The price has to be greater than 0", 400));
    }
    if (this.roomType === "single" && this.maxGuests > 1) {
        return next(new AppError("The max guests for a single room is 1", 400))
    }
    if (this.roomType === "double" && this.maxGuests > 2) {
        return next(new AppError("The max guests for a double room is 2", 400))
    }

    next()
})

// Exclude rooms under maintenance
/* roomSchema.pre(/^find/, function (next) {
    if (!this.options.includeMaintenance) {
        this.find({ status: { $ne: 'maintenance' } });
    }
    next();
});
 */
const Room = mongoose.model("Room", roomSchema);

module.exports = Room;