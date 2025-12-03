const mongoose = require("mongoose");

const crmSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "CRM entry must have a user"],
        unique: true,
        index: true,
    },

    // Loyalty & Points System
    loyaltyPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    loyaltyTier: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum'],
        default: 'bronze'
    },
    pointsHistory: [{
        points: {
            type: Number,
            required: true
        },
        reason: {
            type: String,
            required: true,
            enum: ['stay', 'review', 'referral', 'other']
        },
        description: String,
        date: {
            type: Date,
            default: Date.now
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        stayNights: Number
    }],

    // Discount System
    availableDiscounts: [{
        code: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['percentage', 'fixed', 'free_night', 'amenity'],
            required: true
        },
        value: {
            type: Number,
            required: true,
            min: 0
        },
        description: String,
        minimumStayNights: {
            type: Number,
            default: 0
        },
        roomType: {
            type: String,
            enum: ["single", "double", "suite", "deluxe", "all"],
            default: 'all'
        },
        expiresAt: Date,
        used: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Guest Preferences & Profile
    guestPreferences: {
        room: {
            preferredRoomType: {
                type: String,
                enum: ["single", "double", "suite", "deluxe"],
                default: 'single'
            },
        },
        amenities: [],
        amenitiesFrequency: {
            type: Map, // Object where key is amenity and value is count
            of: Number,
            default: {}
        },
    },

    // Stay History & Statistics
    stayStatistics: {
        totalStays: {
            type: Number,
            default: 0,
            min: 0
        },
        totalNights: {
            type: Number,
            default: 0,
            min: 0
        },
        lifetimeValue: {
            type: Number,
            default: 0,
            min: 0
        },
        averageStayLength: {
            type: Number,
            default: 0,
            min: 0
        },
        favoriteRoomType: String,
        lastStayDate: Date,
        nextExpectedStay: Date
    },

    // Review Statistics & Ratings
    reviewStatistics: {
        totalReviews: {
            type: Number,
            default: 0,
            min: 0
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        ratingDistribution: {
            1: { type: Number, default: 0 },
            2: { type: Number, default: 0 },
            3: { type: Number, default: 0 },
            4: { type: Number, default: 0 },
            5: { type: Number, default: 0 }
        },
        lastReviewDate: Date,
        featuredReviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }]
    },

    // Customer Status & Segmentation
    guestStatus: {
        type: String,
        enum: ['new', 'occasional', 'regular', 'frequent', 'vip', 'inactive'],
        default: 'new'
    },
    isVIP: {
        type: Boolean,
        default: false
    },

    // Referral System
    referralCode: {
        type: String,
        unique: true,
        sparse: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    referralsMade: {
        type: Number,
        default: 0,
        min: 0
    },
    successfulReferrals: {
        type: Number,
        default: 0,
        min: 0
    },
    referralSuccessAwarded: {
        type: Boolean,
        default: false
    },
    referralSuccessBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Virtual for total available discounts
crmSchema.virtual('activeDiscounts',).get(function () {
    const discounts = Array.isArray(this.availableDiscounts)
        ? this.availableDiscounts
        : [];

    return discounts.filter(
        discount => !discount.used && (!discount.expiresAt || discount.expiresAt > new Date())
    );
})

// Virtual for next loyalty tier
crmSchema.virtual('nextTier',).get(function () {
    const tiers = ['bronze', 'silver', 'gold', 'platinum']
    const currentIndex = tiers.indexOf(this.loyaltyTier)
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null
})

// Virtual for days since last stay
crmSchema.virtual('daysSinceLastStay',).get(function () {
    if (!this.stayStatistics.lastStayDate) return null;
    const diffTime = Math.abs(new Date() - this.stayStatistics.lastStayDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
})

crmSchema.virtual('pointsToNextTier',).get(function () {
    const tierPoints = {
        bronze: 0,
        silver: 500,
        gold: 1500,
        platinum: 3000
    }

    const nextTier = this.nextTier

    if (!nextTier) return 0;

    return tierPoints[nextTier] - this.loyaltyPoints
})

crmSchema.virtual("reviewScore").get(function () {
    if (this.reviewStatistics.totalReviews === 0) return 0;
    return this.reviewStatistics.averageRating
})

crmSchema.virtual("positiveReviewPercentage").get(function () {
    if (this.reviewStatistics.totalReviews === 0) return 0;
    const positiveReviews = this.reviewStatistics.ratingDistribution[4] + this.reviewStatistics.ratingDistribution[5];
    return (positiveReviews / this.reviewStatistics.totalReviews) * 100;
})

// Indexes for better query performance
crmSchema.index({ loyaltyPoints: -1 });
crmSchema.index({ 'stayStatistics.lastStayDate': -1 });
crmSchema.index({ 'guestPreferences.room.preferredRoomType': 1 });
crmSchema.index({ 'reviewStatistics.averageRating': -1 });
crmSchema.index({ 'reviewStatistics.totalReviews': -1 });

// Pre-save middleware to update loyalty tier based on points
crmSchema.pre('save', function (next) {
    if (this.isModified('loyaltyPoints')) {
        if (this.loyaltyPoints >= 3000) {
            this.loyaltyTier = 'platinum';
            this.isVIP = true;
        } else if (this.loyaltyPoints >= 1500) {
            this.loyaltyTier = 'gold';
            this.isVIP = true;
        } else if (this.loyaltyPoints >= 500) {
            this.loyaltyTier = 'silver';
            this.isVIP = false;
        } else {
            this.loyaltyTier = 'bronze';
            this.isVIP = false;
        }
    }

    // Update guest status based on stay activity
    if (this.isModified('stayStatistics.totalStays') || this.isModified('stayStatistics.lastStayDate')) {
        const daysSinceLastStay = this.daysSinceLastStay;
        const totalStays = this.stayStatistics.totalStays;

        if (totalStays === 0) {
            this.guestStatus = 'new';
        } else if (totalStays >= 10 && daysSinceLastStay <= 90) {
            this.guestStatus = 'frequent';
        } else if (totalStays >= 3 && daysSinceLastStay <= 180) {
            this.guestStatus = 'regular';
        } else if (daysSinceLastStay <= 365) {
            this.guestStatus = 'occasional';
        } else {
            this.guestStatus = 'inactive';
        }

        // VIP status overrides
        if (this.isVIP) {
            this.guestStatus = 'vip';
        }
    }

    next();
});

// Pre-save middleware to ensure unique user reference
crmSchema.pre('save', async function (next) {
    if (this.isNew) {
        const existingCRM = await this.constructor.findOne({ user: this.user });
        if (existingCRM) {
            throw new Error('CRM entry already exists for this user');
        }
    }
    next();
});

crmSchema.methods.addStayPoint = function (nights, amount, bookingId, description = '') {
    // Calculate points: base points per night + bonus for amount spent
    const basePoints = nights * 100; // 100 points per night
    const spendingPoints = Math.floor(amount / 100); // 1 point per $10 spent
    const totalPoints = basePoints + spendingPoints;

    this.loyaltyPoints += totalPoints;

    this.pointsHistory.push({
        points: totalPoints,
        reason: "stay",
        description: description || `${nights} night stay`,
        booking: bookingId,
        stayNights: nights
    });

    //update stay statistics

    this.stayStatistics.totalStays += 1;
    this.stayStatistics.totalNights += nights;
    this.stayStatistics.lifetimeValue += amount;
    this.stayStatistics.averageStayLength = this.stayStatistics.totalNights / this.stayStatistics.totalStays;
    this.stayStatistics.lastStayDate = new Date();

    return this.save();
}

// Instance method to create hotel-specific discount
crmSchema.methods.createHotelDiscount = function (discountData) {
    const discount = {
        code: discountData.code || `HOTEL${Date.now()}`,
        type: discountData.type,
        value: discountData.value,
        description: discountData.description,
        minimumStayNights: discountData.minimumStayNights || 0,
        roomType: discountData.roomType || 'all',
        expiresAt: discountData.expiresAt,
        used: false,
        createdAt: new Date()
    };

    this.availableDiscounts.push(discount);
    return this.save();
};

crmSchema.methods.useDiscount = function (discountCode) {
    const discount = this.availableDiscounts.find(d => d.code === discountCode)
    if (discount && !discount.used && (!discount.expiresAt || discount.expiresAt > new Date())) {
        discount.used = true;
        return this.save().then(() => discount)
    }
    return Promise.resolve(null)
}

crmSchema.methods.updatePreferences = function (preferenceUpdates) {
    Object.keys(preferenceUpdates).forEach(key => {
        this.guestPreferences[key] = { ...this.guestPreferences[key], ...preferenceUpdates[key] }
    })

    return this.save()
}

// Method to update review statistics when a new review is added
crmSchema.methods.updateReviewStats = async function (review, action = 'add') {

    if (action === 'add') {
        this.reviewStatistics.totalReviews += 1;
        this.reviewStatistics.averageRating =
            ((this.reviewStatistics.averageRating * (this.reviewStatistics.totalReviews - 1)) + review.rating) /
            this.reviewStatistics.totalReviews;

        const roundedRating = Math.round(review.rating);
        if (roundedRating >= 1 && roundedRating <= 5) {
            this.reviewStatistics.ratingDistribution[roundedRating] += 1;
        }

        this.reviewStatistics.lastReviewDate = new Date();

        // Add review to featured reviews array
        this.reviewStatistics.featuredReviews.push(review._id);

        // Add points for review
        await this.addPoints(50, 'review', `Review for booking`, null, review._id);

    } else if (action === 'remove') {
        this.reviewStatistics.totalReviews -= 1;
        if (this.reviewStatistics.totalReviews > 0) {
            this.reviewStatistics.averageRating =
                ((this.reviewStatistics.averageRating * (this.reviewStatistics.totalReviews + 1)) - review.rating) /
                this.reviewStatistics.totalReviews;
        } else {
            this.reviewStatistics.averageRating = 0;
        }

        const roundedRating = Math.round(review.rating);
        if (roundedRating >= 1 && roundedRating <= 5) {
            this.reviewStatistics.ratingDistribution[roundedRating] =
                Math.max(0, this.reviewStatistics.ratingDistribution[roundedRating] - 1);
        }

        // Ensure featuredReviews is an array before filtering
        const featured = Array.isArray(this.reviewStatistics.featuredReviews)
            ? this.reviewStatistics.featuredReviews
            : [];

        // Remove review from featured reviews array
        this.reviewStatistics.featuredReviews = featured.filter(
            reviewId => reviewId.toString() !== review._id.toString()
        );

    }

    await this.save();
};

// Enhanced addPoints method to handle review points
crmSchema.methods.addPoints = async function (points, reason, description = '', booking = null, review = null) {
    this.loyaltyPoints += points;

    this.pointsHistory.push({
        points,
        reason,
        description,
        booking,
        review,
        date: new Date()
    });

    return this.save();
};

// Method to get review insights
crmSchema.methods.getReviewInsights = function () {
    const stats = this.reviewStatistics;
    return {
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews,
        positivePercentage: ((stats.ratingDistribution[4] + stats.ratingDistribution[5]) / stats.totalReviews * 100).toFixed(1),
        responseRate: '0%', // You can track if hotels respond to reviews
    };
};

const CRM = mongoose.model('CRM', crmSchema)

module.exports = CRM;