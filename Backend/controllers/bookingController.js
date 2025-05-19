const mongoose = require('mongoose');
const Booking = require('./../models/bookingModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');
const Room = require('../models/roomModel');
const User = require('../models/userModel');


exports.setRoomUserIds = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    if (!req.body.room) req.body.room = req.params.roomId;
    next();
};

exports.getBookingsByUser = catchAsync(async (req, res, next) => {
    const currentDate = new Date();
    let filter = { user: req.user.id };

    // Handle status filtering
    if (req.query.status) {
        switch (req.query.status) {
            case 'upcoming':
                filter.checkIn = { $gt: currentDate };
                break;
            case 'current':
                filter.$and = [
                    { checkIn: { $lte: currentDate } },
                    { checkOut: { $gt: currentDate } }
                ];
                break;
            case 'past':
                filter.checkOut = { $lte: currentDate };
                break;
        }
    }

    // Handle paid filter
    if (req.query.paid !== undefined) {
        filter.paid = req.query.paid === 'true';
    }

    // Clone query and remove special parameters
    const queryCopy = { ...req.query };
    ['status', 'page', 'limit', 'sort', 'fields'].forEach(el => delete queryCopy[el]);

    // Count total documents WITH FILTERS
    const total = await Booking.countDocuments(filter);

    // Get pagination values
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get paginated results
    const bookings = await Booking.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(req.query.sort || '-createdAt')
        .populate({
            path: 'user',
            select: 'username email'
        });

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: {
            data: bookings
        }
    });
});

exports.getBookingsByRoom = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({ room: req.params.id });
    if (!bookings || bookings.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No bookings found for this room'
        });
    }

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings
        }
    });
});

exports.markBookingAsPaid = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id).populate('user');

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404));
    }

    // Check if the user making the request is the one who booked the room
    if (booking.user._id.toString() !== req.user.id.toString()) {
        return next(new AppError('You do not have permission to mark this booking as paid', 403));
    }

    booking.paid = true;
    await booking.save();

    res.status(200).json({
        status: 'success',
        data: {
            booking
        }
    });
});

exports.createBooking = catchAsync(async (req, res, next) => {
    const newBooking = await Booking.create(req.body);
    const populatedBooking = await Booking.findById(newBooking._id).populate('user').populate('room');

    res.status(201).json({
        status: 'success',
        data: {
            booking: populatedBooking
        }
    });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
    const currentDate = new Date();
    let filters = {};

    // Handle status filtering
    if (req.query.status) {
        switch (req.query.status) {
            case 'upcoming':
                filters.checkIn = { $gt: currentDate };
                break;
            case 'current':
                filters.$and = [
                    { checkIn: { $lte: currentDate } },
                    { checkOut: { $gt: currentDate } }
                ];
                break;
            case 'past':
                filters.checkOut = { $lte: currentDate };
                filters.paid = { $ne: 'missed' }; // Exclude missed bookings from past
                break;
            case 'missed':
                filters.paid = 'missed';
                break;
        }
    }



    // Handle search for room.roomNumber, room.roomType, and user fields
    if (req.query.search) {
        const searchTerm = req.query.search.trim();
        if (searchTerm) {
            const roomSearchConditions = [
                { roomType: { $regex: searchTerm, $options: 'i' } },
                { roomNumber: { $regex: searchTerm, $options: 'i' } }
            ];

            const userSearchConditions = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];

            // Exact match if searchTerm is numeric
            if (!isNaN(searchTerm)) {
                roomSearchConditions.push({ roomNumber: parseInt(searchTerm) });
            }

            const rooms = await Room.find({
                $or: roomSearchConditions
            }).select('_id');

            const users = await User.find({
                $or: userSearchConditions
            }).select('_id');

            const roomIds = rooms.map(room => room._id);
            const userIds = users.map(user => user._id);

            // Combine room and user conditions with OR
            if (roomIds.length > 0 || userIds.length > 0) {
                filters.$or = [];
                if (roomIds.length > 0) {
                    filters.$or.push({ room: { $in: roomIds } });
                }
                if (userIds.length > 0) {
                    filters.$or.push({ user: { $in: userIds } });
                }
            } else {
                // If no matches found, return no results
                filters._id = null;
            }
        }
    }

    // Initialize APIFeatures and apply filters
    const features = new APIFeatures(Booking.find(), req.query)
        .mergeFilters(filters) // Merge status-based filters
        .filter()
        .applyFilters(); // Apply accumulated filters

    // Get total count before pagination
    const total = await Booking.countDocuments(features.filters);

    // Apply remaining operations
    features
        .sort()
        .limitFields()
        .paginate();

    // Execute query with explicit population
    const bookings = await features.query
        .populate({
            path: 'user',
            select: 'name email'
        })
        .populate({
            path: 'room',
            select: 'roomNumber price roomType'
        });

    // Calculate pagination details
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        total,
        totalPages,
        currentPage: page,
        data: {
            data: bookings
        }
    });
});

exports.getBookingCounts = catchAsync(async (req, res, next) => {
    const currentDate = new Date();

    const upcomingCount = await Booking.countDocuments({ checkIn: { $gt: currentDate } });
    const currentCount = await Booking.countDocuments({
        $and: [
            { checkIn: { $lte: currentDate } },
            { checkOut: { $gt: currentDate } }
        ]
    });
    const pastCount = await Booking.countDocuments({ checkOut: { $lte: currentDate } });
    const totalCount = await Booking.countDocuments();

    res.status(200).json({
        status: 'success',
        total: totalCount,
        data: {
            upcoming: upcomingCount,
            current: currentCount,
            past: pastCount
        }
    });
});

exports.getUserBookingCounts = catchAsync(async (req, res, next) => {
    const currentDate = new Date();

    const upcomingCount = await Booking.countDocuments({ user: req.user.id, checkIn: { $gt: currentDate } });
    const currentCount = await Booking.countDocuments({
        user: req.user.id,
        $and: [
            { checkIn: { $lte: currentDate } },
            { checkOut: { $gt: currentDate } }
        ]
    });
    const pastCount = await Booking.countDocuments({ user: req.user.id, checkOut: { $lte: currentDate } });

    res.status(200).json({
        status: 'success',
        data: {
            upcoming: upcomingCount,
            current: currentCount,
            past: pastCount
        }
    });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const booking = await Booking.findByIdAndDelete(req.params.id).session(session);

        if (!booking) {
            return next(new AppError('No booking found with that ID', 404));
        }

        // Delete associated reviews in transaction
        await Review.deleteMany({ booking: booking._id }).session(session);

        await session.commitTransaction();

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
});

exports.getRoomBookingCounts = catchAsync(async (req, res, next) => {
    const bookingCounts = await Booking.aggregate([
        {
            $group: {
                _id: '$room',
                totalBookings: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'rooms',
                localField: '_id',
                foreignField: '_id',
                as: 'roomDetails'
            }
        },
        {
            $unwind: '$roomDetails'
        },
        {
            $project: {
                _id: 0,
                roomId: '$_id',
                roomNumber: '$roomDetails.roomNumber',
                roomType: '$roomDetails.roomType',
                totalBookings: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            bookingCounts
        }
    });
});

exports.getTopBookers = catchAsync(async (req, res, next) => {
    const topBookers = await Booking.aggregate([
        {
            $group: {
                _id: '$user',
                totalBookings: { $sum: 1 },
                totalSpent: { $sum: '$price' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $unwind: '$userDetails'
        },
        {
            $project: {
                _id: 0,
                userId: '$_id',
                name: '$userDetails.name',
                email: '$userDetails.email',
                totalBookings: 1,
                totalSpent: 1
            }
        },
        {
            $sort: { totalBookings: -1 }
        },
        {
            $limit: 10
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            topBookers
        }
    });
});

exports.getTopSpenders = catchAsync(async (req, res, next) => {
    const topSpenders = await Booking.aggregate([
        {
            $group: {
                _id: '$user',
                totalSpent: { $sum: '$price' },
                totalBookings: { $sum: 1 },
                averageSpent: { $avg: '$price' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $unwind: '$userDetails'
        },
        {
            $project: {
                _id: 0,
                userId: '$_id',
                name: '$userDetails.name',
                email: '$userDetails.email',
                totalSpent: { $round: ['$totalSpent', 2] },
                averageSpent: { $round: ['$averageSpent', 2] },
                totalBookings: 1
            }
        },
        {
            $sort: { totalSpent: -1 }
        },
        {
            $limit: 10
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            topSpenders
        }
    });
});

exports.getTotalRevenue = catchAsync(async (req, res, next) => {
    const result = await Booking.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$price' },
                totalBookings: { $sum: 1 },
                averageBookingPrice: { $avg: '$price' }
            }
        },
        {
            $project: {
                _id: 0,
                totalRevenue: { $round: ['$totalRevenue', 2] },
                totalBookings: 1,
                averageBookingPrice: { $round: ['$averageBookingPrice', 2] }
            }
        }
    ]);

    const stats = result.length > 0 ? result[0] : {
        totalRevenue: 0,
        totalBookings: 0,
        averageBookingPrice: 0
    };

    res.status(200).json({
        status: 'success',
        data: stats
    });
});

exports.getMonthlyBookings = catchAsync(async (req, res, next) => {
    const year = parseInt(req.params.year);

    // Validate year parameter
    if (!year || isNaN(year) || year < 2000 || year > 2100) {
        return next(new AppError('Please provide a valid year between 2000 and 2100', 400));
    }

    const bookingsByMonth = await Booking.aggregate([
        {
            $match: {
                checkIn: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$checkIn' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Create an array with all months initialized to 0
    const allMonths = Array.from({ length: 12 }, (_, i) => ({

        monthName: monthNames[i],
        count: 0
    }));

    // Update counts for months that have bookings
    bookingsByMonth.forEach(booking => {
        allMonths[booking._id - 1].count = booking.count;
    });

    res.status(200).json({
        status: 'success',
        data: {
            year,
            months: allMonths
        }
    });
});

exports.getMostBookedRooms = catchAsync(async (req, res, next) => {
    const mostBookedRooms = await Booking.aggregate([
        {
            $group: {
                _id: '$room',
                bookingCount: { $sum: 1 },
                totalRevenue: { $sum: '$price' }
            }
        },
        {
            $lookup: {
                from: 'rooms',
                localField: '_id',
                foreignField: '_id',
                as: 'roomDetails'
            }
        },
        {
            $unwind: '$roomDetails'
        },
        {
            $project: {
                _id: 0,
                roomId: '$_id',
                roomNumber: '$roomDetails.roomNumber',
                roomType: '$roomDetails.roomType',
                bookingCount: 1,
                totalRevenue: { $round: ['$totalRevenue', 2] },
                averageRevenue: {
                    $round: [{ $divide: ['$totalRevenue', '$bookingCount'] }, 2]
                }
            }
        },
        {
            $sort: { bookingCount: -1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        results: mostBookedRooms.length,
        data: {
            rooms: mostBookedRooms
        }
    });
});

exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);

exports.deleteUnpaidBookingsAtCheckIn = catchAsync(async (req, res, next) => {
    const currentDate = new Date();
    currentDate.setHours(11, 0, 0, 0); // Set to 11 for check-in time

    // Find all unpaid bookings where check-in date is today or in the past
    const unpaidBookings = await Booking.find({
        paid: 'unpaid',
        checkIn: { $lte: currentDate }
    }).populate('user');

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        for (const booking of unpaidBookings) {
            // Mark the booking as missed
            booking.paid = 'missed';
            await booking.save({ session });

            // Here you could add code to send notification to user
            // For example: sendEmail(booking.user.email, 'Booking Cancelled', 'Your booking was cancelled due to non-payment')
        }

        await session.commitTransaction();

        res.status(200).json({
            status: 'success',
            message: `Successfully marked ${unpaidBookings.length} unpaid bookings as missed`,
            data: {
                processedCount: unpaidBookings.length
            }
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
});

