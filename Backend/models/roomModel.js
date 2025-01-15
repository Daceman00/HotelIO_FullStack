const mongoose = require("mongoose");
const AppError = require('./../utils/appError');

const roomSchema = mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, "Room number is required"],
        unique: true,
    },

    roomType: {
        type: String,
        required: [true, "Room type is required"],
        enum: ["single", "double", "suite", "deluxe"]
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [1, "Price must be at least 1"]
    },

    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available'
    },

    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [10, "Description must be at least 10 characters long"]
    },

    imageCover: {
        type: String,

    },
    images: [String],

    features: {
        type: [String],
        default: [],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: "A room should have at least one feature"
        }
    },

    maxGuests: {
        type: Number,
        required: [true, "Max guests is required"],
        min: [1, "Min guests must be at least 1"]
    },

    averageRating: {
        type: Number,
        min: [1, "Average rating must be at least 1"],
        max: [5, "Average rating cannot exceed 5"],
        default: undefined,
        validate: {
            validator: function (v) {
                return v === undefined || v === 0 || (v >= 1 && v <= 5);
            },
            message: "Average rating must be 0 or between 1 and 5"
        }
    },

    numRatings: {
        type: Number,
        default: 0,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

roomSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'room',
    localField: '_id'
});

roomSchema.virtual('bookings', {
    ref: 'Booking',
    foreignField: 'room',
    localField: '_id'
})

// Room number sanitize
roomSchema.pre('save', function (next) {
    this.roomNumber = this.roomNumber.trim().toUpperCase();
    this.roomType = this.roomType.trim().toLowerCase().replace(/^\w/, c => c.toUpperCase());
    next()
})

// Middleware to sanitize roomType before validation
roomSchema.pre('validate', function (next) {
    this.roomType = this.roomType.trim().toLowerCase();
    next();
});

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

// Middleware to update the updatedAt field
roomSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});


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