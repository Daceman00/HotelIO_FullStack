const mongoose = require("mongoose");

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
        default: Date.now
    }
})

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;