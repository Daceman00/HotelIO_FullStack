const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

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

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
        type: Boolean,
        default: true,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'user',
    localField: '_id'
});

userSchema.virtual('bookings', {
    ref: 'Booking',
    foreignField: 'user',
    localField: '_id'
})

// Password encryption
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next()
})

// Show only active users in query results
userSchema.pre('find', function (next) {
    this.find({ active: { $ne: false } });
    next();
})

// Update passwordChangedAt when password is changed
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next()
})

// Delete all reviews, bookings, and user photo associated with this user
userSchema.pre('deleteOne', { document: true, query: false }, async function () {
    const userId = this._id;

    await mongoose.model('Review').deleteMany({ user: userId });
    await mongoose.model('Booking').deleteMany({ user: userId });

    // Delete user photo from public folder
    if (this.photo) {
        const photoPath = path.join(__dirname, '..', 'public', 'img', 'users', this.photo);
        fs.unlink(photoPath, (err) => {
            if (err) console.error('Failed to delete user photo:', err);
        });
    }
});

// Compare password i passwordConfirm
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

// Check if user changed password after the last login
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    return false; // false means NOT changed
}

// Creating password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');


    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User;