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

exports.createCrmEntry = factory.createOne(CRM)
exports.updateCrmEntry = factory.updateOne(CRM)
exports.deleteCrmEntry = factory.deleteOne(CRM)