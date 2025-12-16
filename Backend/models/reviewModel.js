const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty!'],
        maxlength: [1000, 'Review must be less than or equal to 500 characters']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "Review must have a user"]
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: [true, "Review must be associated with a room"]
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Static method to calculate average ratings
reviewSchema.statics.calculateAverageRating = async function (roomId) {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        throw new Error("Invalid Room ID");
    }

    try {
        const stats = await this.aggregate([
            { $match: { room: new mongoose.Types.ObjectId(roomId) } },
            {
                $group: {
                    _id: '$room',
                    averageRating: { $avg: '$rating' },
                    numRatings: { $sum: 1 }
                }
            }
        ]);

        const Room = mongoose.model('Room');
        let updateData = {};

        if (stats.length > 0) {
            // Round to 1 decimal place for display
            const roundedRating = Math.round(stats[0].averageRating * 10) / 10;
            updateData = {
                averageRating: roundedRating,
                numRatings: stats[0].numRatings
            };
        } else {
            // Set to 0 when no reviews exist
            updateData = {
                averageRating: 0,
                numRatings: 0
            };
        }

        await Room.findByIdAndUpdate(
            roomId,
            updateData,
            { new: true, runValidators: true }
        );
    } catch (error) {
        console.error(`Error calculating average rating: ${error.message}`);
        throw error;
    }
};
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    this.populate({
        path: 'room',
        select: 'roomNumber price'
    });
    next();
});

// Update average rating after saving or removing a review
reviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.room);
});

reviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.room);
});

// Pre-remove middleware to update CRM when a review is deleted
reviewSchema.pre('remove', async function (next) {
    try {
        const Review = this.constructor;

        // Find all reviews being deleted (for deleteMany operations)
        let reviewsToDelete;
        if (this._id) {
            // Single document deletion
            reviewsToDelete = [this];
        } else {
            // For deleteMany, we need to handle it differently
            // This is a limitation - for deleteMany you might want to use post-remove
            return next();
        }

        // Update CRM for each deleted review
        for (const review of reviewsToDelete) {
            // Get user and CRM
            const user = await mongoose.model('User').findById(review.user);
            if (!user) continue;

            // Get CRM (populate or find)
            const crm = await mongoose.model('CRM').findOne({ user: user._id });
            if (!crm) continue;

            // Update review statistics
            await crm.updateReviewStats(review, 'remove');
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Add indexes for efficient querying of reviews
reviewSchema.index({ room: 1 }); // For finding all reviews for a room
reviewSchema.index({ user: 1 }); // For finding all reviews by a user
reviewSchema.index({ rating: -1 }); // For sorting/filtering reviews by rating
reviewSchema.index({ createdAt: -1 }); // For getting latest reviews efficiently

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;