const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...unallowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (!unallowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

exports.getMyAccount = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

exports.updateMyAccount = catchAsync(async (req, res, next) => {
    // Create error if user POSTs password
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400))
    }

    // Filter out fields that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'email', 'name')

    if (req.body.name || req.body.email) {
        return next(new AppError('You are not allowed to change your name or email', 400))
    }

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    })
})

exports.deleteMyAccount = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getUser = factory.getOne(User)
exports.getAllUsers = factory.getAll(User)
exports.updateUser = factory.updateOne(User)
exports.createUser = factory.createOne(User)
exports.deleteUser = factory.deleteOne(User)
