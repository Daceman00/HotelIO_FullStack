const catchAsync = require('../utils/catchAsync')
const User = require('./../models/userModel')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const { promisify } = require('util');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;
    console.log("Generated Token:", token);
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });

}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    createSendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
    // Get token and check if it's there
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log("Token received:", token);
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401))
    }

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log("Decoded JWT payload:", decoded);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does not exist', 401))
    }

    // Chacek is user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        {
            return next(new AppError('User recently changed password! Please log in again', 401))
        }
    }

    // Grant access to protected routes
    req.user = currentUser;
    console.log("Current user", req.user)
    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'user']
        console.log(req.user.role)
        console.log(roles)
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }

        next()
    }
}
