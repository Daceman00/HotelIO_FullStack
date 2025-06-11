const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    });

exports.updateOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });

exports.getAll = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let filter = {};
        // If a roomId parameter is present in the request, filter by roomId
        if (req.params.roomId) filter = { tour: req.params.roomId };

        // Count total documents
        const total = await Model.countDocuments(filter);

        // Calculate total pages and current page
        // Pagination parameters
        // page: current page number (default: 1)
        // limit: number of documents per page (default: 100)
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const totalPages = Math.ceil(total / limit);

        let features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        let query = features.query;
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: doc.length,
            total,
            page,
            totalPages,
            data: {
                data: doc
            }
        });
    });