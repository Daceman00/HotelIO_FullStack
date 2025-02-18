const mongoose = require('mongoose');
const Room = require('../models/roomModel');
const Review = require('../models/reviewModel');

exports.calculateAverageRating = async (roomId) => {
    console.log(`Calculating average rating for room ID: ${roomId}`);

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        console.error("Invalid Room ID");
        throw new Error("Invalid Room ID");
    }

    try {
        const stats = await Review.aggregate([
            { $match: { room: new mongoose.Types.ObjectId(roomId) } },
            {
                $group: {
                    _id: '$room',
                    averageRating: { $avg: '$rating' },
                    numRatings: { $sum: 1 }
                }
            }
        ]);

        console.log(`Aggregation result: ${JSON.stringify(stats)}`);

        const updateData = stats.length > 0
            ? {
                averageRating: stats[0].averageRating,
                numRatings: stats[0].numRatings
            }
            : {
                averageRating: 0,
                numRatings: 0
            };

        console.log(`Updating room with data: ${JSON.stringify(updateData)}`);

        await Room.findByIdAndUpdate(roomId, updateData, { new: true, runValidators: true });
        console.log(`Room ${roomId} updated successfully`);
    } catch (error) {
        console.error(`Error calculating average rating: ${error.message}`);
        throw error;
    }
};