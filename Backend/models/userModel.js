const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only work on save and create
            validator: function (el) {
                return el === this.password
            },
            message: 'Password are not the same!'
        }
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User;