const catchAsync = require('../utils/catchAsync')
const User = require('./../models/userModel')
const CRM = require('./../models/crmModel');
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const sendEmail = require('./../utils/email');
const crypto = require('crypto')
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
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });

}

exports.signup = catchAsync(async (req, res, next) => {

    try {
        // Extract referral code from request body
        const { referralCode } = req.body;

        // Create a new user instance to validate
        const user = new User(req.body);

        // Validate the user data
        await user.validate();

        // Save the user
        const newUser = await user.save();

        // Handle referral if code was provided
        if (referralCode) {

            // Find the referrer's CRM by their referral code
            const referrerCRM = await CRM.findOne({ referralCode: referralCode });

            if (referrerCRM) {
                // Get the newly created CRM for this user
                const newUserCRM = await CRM.findOne({ user: newUser._id });

                // Link the new user to their referrer
                newUserCRM.referredBy = referrerCRM.user;
                await newUserCRM.save();

                // Update referrer's stats and give bonus
                referrerCRM.referralsMade += 1;
                await referrerCRM.addPoints(100, 'referral', 'Referral bonus - new signup');
                await referrerCRM.save();
            }
        }

        createSendToken(newUser, 201, res)
    } catch (error) {
        throw error; // Re-throw to let catchAsync handle it
    }
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    const user = await User.findOne({ email, active: true }).select("+password")

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
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401))
    }

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

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

    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'user']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }

        next()
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // Get user based on email
    const user = await User.findOne({ email: req.body.email });
    // Check is that user exists
    if (!user) return next(new AppError('There is no user with that email address', 404));

    // Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })

    // Send email with token
    const resetURL = `https://hoteliodario.netlify.app/resetPassword/${resetToken}`;

    const message = `
    You requested a password reset. Click the link below to reset your password:
    ${resetURL}

    If you did not request a password reset, please ignore this email.
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token is valid for 10 minutes',
            message: message
        })

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new AppError('There was an error sending email. Try again!', 500))
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    // Get user based on token
    const hasehdToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({ passwordResetToken: hasehdToken, passwordResetExpires: { $gt: Date.now() } })

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save();

    createSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError("Your current password is incorrect", 401))
    }

    // If it is true , update the password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    //Log in user
    createSendToken(user, 200, res)

})

exports.isLoggedIn = catchAsync(async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
})

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};