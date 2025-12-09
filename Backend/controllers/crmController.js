const mongoose = require('mongoose');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');
const CRM = require('../models/crmModel')
const User = require('../models/userModel')

exports.getAllCrmEntrys = factory.getAll(CRM, [
    {
        path: 'user',
        select: 'name email photo role',
    },
    {
        path: 'pointsHistory.booking',
        select: 'checkIn checkOut createdAt'
    }])

exports.getCrmEntry = factory.getOne(CRM, [
    {
        path: 'user',
        select: 'name email photo role',
    },
    {
        path: 'pointsHistory.booking',
        select: 'checkIn checkOut createdAt'
    }])

exports.getMyCrmEntry = catchAsync(async (req, res, next) => {
    const crmEntry = await CRM.findOne({ user: req.user.id })
        .populate([
            {
                path: 'user',
                select: 'name email photo role',
            },
            {
                path: 'pointsHistory.booking',
                select: 'checkIn checkOut createdAt'
            }
        ])

    if (!crmEntry) {
        return next(new AppError('No CRM entry found for this user', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: crmEntry
        }
    })
})

exports.createCrmEntry = factory.createOne(CRM)
exports.updateCrmEntry = factory.updateOne(CRM)
exports.deleteCrmEntry = factory.deleteOne(CRM)