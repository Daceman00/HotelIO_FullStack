const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require("../models/userModel")
const CRM = require('../models/crmModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const Room = require('../models/roomModel');

// Load environment variables (match server configuration)
dotenv.config({ path: './.env' });

// Build DB connection string
const DB = (process.env.DATABASE || '').includes('<PASSWORD>')
    ? process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD || '')
    : process.env.DATABASE;

async function migrateExistingUsers() {
    try {
        console.log('Starting CRM migration for existing users...');

        // Find all users without CRM entries
        const usersWithoutCRM = await User.aggregate([
            {
                $lookup: {
                    from: 'crms',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'crmEntries'
                }
            },
            {
                $match: {
                    'crmEntries.0': { $exists: false }
                }
            }
        ]);

        console.log(`Found ${usersWithoutCRM.length} users without CRM entries`);

        let migratedCount = 0;
        let errorCount = 0;

        for (const user of usersWithoutCRM) {
            try {
                await createCRMForExistingUser(user);
                migratedCount++;

                if (migratedCount % 50 === 0) {
                    console.log(`Progress: ${migratedCount}/${usersWithoutCRM.length} users migrated`);
                }
            } catch (error) {
                console.error(`Error migrating user ${user.email}:`, error.message);
                errorCount++;
            }
        }

        console.log(`Migration completed!`);
        console.log(`Successfully migrated: ${migratedCount} users`);
        console.log(`Errors: ${errorCount} users`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        mongoose.connection.close();
    }
}

async function createCRMForExistingUser(user) {
    // Get user's bookings and reviews to calculate statistics
    const userBookings = await mongoose.connection.collection('bookings').find({ user: user._id }).toArray();
    const userReviews = await mongoose.connection.collection('reviews').find({ user: user._id }).toArray();

    // Calculate stay statistics from bookings
    const stayStats = calculateStayStatistics(userBookings);

    // Calculate review statistics
    const reviewStats = calculateReviewStatistics(userReviews);

    // Calculate loyalty points from past stays and reviews
    const { totalPoints, pointsHistory } = await calculateHistoricalPoints(userBookings, userReviews);

    // Generate unique referral code
    const referralCode = `HOTEL${user._id.toString().slice(-8).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // Determine guest status based on stay history and reviews
    const guestStatus = determineGuestStatus(stayStats, reviewStats);

    // Generate discounts based on user's history
    const availableDiscounts = generateAvailableDiscounts(stayStats, reviewStats, totalPoints);

    // Extract amenities ONLY from rooms the user has actually booked
    const bookedAmenities = await extractAmenitiesWithFrequency(userBookings);
    const sortedAmenities = sortAmenitiesByFrequency(bookedAmenities);


    // Create CRM entry
    const crmData = new CRM({
        user: user._id,
        referralCode,
        loyaltyPoints: totalPoints,
        pointsHistory,
        stayStatistics: stayStats,
        reviewStatistics: reviewStats,
        guestStatus,
        availableDiscounts,
        guestPreferences: {
            room: {
                preferredRoomType: determinePreferredRoomType(userBookings),
            },
            amenities: sortedAmenities,
            amenitiesFrequency: bookedAmenities
        },
    });

    // Fix validation issues
    if (crmData.reviewStatistics.averageRating < 1) {
        crmData.reviewStatistics.averageRating = 0;
    }

    const crmEntry = new CRM(crmData);
    await crmEntry.save();
    console.log(`✓ Created CRM for: ${user.email} | Stays: ${stayStats.totalStays} | Reviews: ${reviewStats.totalReviews} | Discounts: ${availableDiscounts.length} | Points: ${totalPoints}`);
}

function calculateStayStatistics(bookings) {
    const completedBookings = bookings.filter(booking =>
        booking.paid === 'paid'
    );

    const totalStays = completedBookings.length;
    const totalNights = completedBookings.reduce((sum, booking) => {
        const nights = calculateNights(booking.checkIn, booking.checkOut);
        return sum + nights;
    }, 0);

    const lifetimeValue = completedBookings.reduce((sum, booking) => {
        return sum + (booking.price || 0);
    }, 0);

    const averageStayLength = totalStays > 0 ? totalNights / totalStays : 0;

    // Find last stay date
    const lastStayDate = completedBookings.length > 0
        ? new Date(Math.max(...completedBookings.map(b => new Date(b.checkOut))))
        : null;

    return {
        totalStays,
        totalNights,
        lifetimeValue,
        averageStayLength,
        lastStayDate
    };
}

function calculateReviewStatistics(reviews) {
    const totalReviews = reviews.length;

    if (totalReviews === 0) {
        return {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            lastReviewDate: null,
            featuredReviews: []
        };
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const averageRating = totalRating / totalReviews;

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
        const rating = Math.round(review.rating); // Round to nearest integer for distribution
        if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating]++;
        }
    });


    // Find last review date
    const lastReviewDate = new Date(Math.max(...reviews.map(r => new Date(r.createdAt))));

    // Identify featured reviews (reviews with high rating and many helpful votes)
    const featuredReviews = reviews
        .filter(review => review.rating >= 4)
        .slice(0, 5) // Limit to 5 featured reviews
        .map(review => review._id);

    return {
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(2)),
        ratingDistribution,
        lastReviewDate,
        featuredReviews
    };
}

async function calculateHistoricalPoints(bookings, reviews) {
    let totalPoints = 0;
    const pointsHistory = [];

    const completedBookings = bookings.filter(booking =>
        booking.paid === 'paid'
    );

    // Points from stays
    for (const booking of completedBookings) {
        const nights = calculateNights(booking.checkIn, booking.checkOut);
        const amount = booking.price || 0;

        // Use the same point calculation as in the CRM model
        const basePoints = nights * 100;
        const spendingPoints = Math.floor(amount / 10);
        const totalPointsForStay = basePoints + spendingPoints;

        totalPoints += totalPointsForStay;

        pointsHistory.push({
            points: totalPointsForStay,
            reason: 'stay',
            description: `Historical stay: ${nights} nights`,
            booking: booking._id,
            stayNights: nights,
            date: booking.checkOut // Use checkout date as point earning date
        });
    }

    // Points from reviews (award points for each review written)
    reviews.forEach((review, index) => {
        const reviewPoints = 50; // 50 points per review
        totalPoints += reviewPoints;

        pointsHistory.push({
            points: reviewPoints,
            reason: 'review',
            description: `Review for ${review.hotel && review.hotel.name || 'hotel'}`,
            date: review.createdAt || new Date(),
            review: review._id
        });
    });

    // Bonus points for high-quality reviews (4-5 stars)
    const highQualityReviews = reviews.filter(review => review.rating >= 4);
    if (highQualityReviews.length > 0) {
        const qualityBonusPoints = highQualityReviews.length * 25;
        totalPoints += qualityBonusPoints;

        pointsHistory.push({
            points: qualityBonusPoints,
            reason: 'review',
            description: `Quality review bonus (${highQualityReviews.length} reviews)`,
            date: new Date()
        });
    }

    return { totalPoints, pointsHistory };
}

function calculateNights(checkIn, checkOut) {
    const oneDay = 24 * 60 * 60 * 1000;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.round(Math.abs((checkOutDate - checkInDate) / oneDay));
}

function determineGuestStatus(stayStats, reviewStats) {
    const { totalStays, lastStayDate } = stayStats;
    const { totalReviews, averageRating } = reviewStats;

    if (!lastStayDate) return 'new';

    const daysSinceLastStay = Math.floor((new Date() - new Date(lastStayDate)) / (1000 * 60 * 60 * 24));

    // Upgrade status for guests with many positive reviews
    const isReviewInfluencer = totalReviews >= 5 && averageRating >= 4.0;

    if (totalStays >= 10 && daysSinceLastStay <= 90) {
        return isReviewInfluencer ? 'vip' : 'frequent';
    } else if (totalStays >= 3 && daysSinceLastStay <= 180) {
        return isReviewInfluencer ? 'regular' : 'regular';
    } else if (daysSinceLastStay <= 365) {
        return 'occasional';
    } else {
        return 'inactive';
    }
}

function determinePreferredRoomType(bookings) {
    const roomTypeCount = {};

    bookings.forEach(booking => {
        const roomType = booking.roomType || (booking.room && booking.room.roomType) || 'standard';
        const mappedRoomType = mapRoomTypeToEnum(roomType);
        roomTypeCount[mappedRoomType] = (roomTypeCount[mappedRoomType] || 0) + 1;
    });

    if (Object.keys(roomTypeCount).length === 0) return 'double';

    const preferredType = Object.keys(roomTypeCount).reduce((a, b) =>
        roomTypeCount[a] > roomTypeCount[b] ? a : b
    );

    return preferredType;
}

function mapRoomTypeToEnum(roomType) {
    const roomTypeMap = {
        'standard': 'double',
        'single': 'single',
        'double': 'double',
        'suite': 'suite',
        'deluxe': 'deluxe',
        'villa': 'suite',
        'executive': 'deluxe'
    };
    return roomTypeMap[roomType.toLowerCase()] || 'double';
}

function generateAvailableDiscounts(stayStats, reviewStats, loyaltyPoints) {
    const discounts = [];
    const now = new Date();

    // Base welcome discount for all users
    discounts.push({
        code: `WELCOME${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        type: 'percentage',
        value: 10,
        description: "Welcome discount",
        applicableTo: 'room_rate',
        minimumStay: 1,
        roomType: 'all',
        expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        used: false,
        createdAt: now
    });

    // Discount based on number of stays
    if (stayStats.totalStays >= 3) {
        discounts.push({
            code: `RETURN${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            type: 'percentage',
            value: 15,
            description: "Returning guest discount",
            applicableTo: 'room_rate',
            minimumStay: 2,
            roomType: 'all',
            expiresAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days
            used: false,
            createdAt: now
        });
    }

    if (stayStats.totalStays >= 5) {
        discounts.push({
            code: `LOYAL${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            type: 'percentage',
            value: 20,
            description: "Loyal guest discount",
            applicableTo: 'all_services',
            minimumStay: 2,
            roomType: 'all',
            expiresAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days
            used: false,
            createdAt: now
        });
    }

    // Discount based on loyalty points
    if (loyaltyPoints >= 500) {
        discounts.push({
            code: `SILVER${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            type: 'fixed',
            value: 50,
            description: "Silver member discount",
            applicableTo: 'room_rate',
            minimumStay: 2,
            roomType: 'all',
            expiresAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
            used: false,
            createdAt: now
        });
    }

    if (loyaltyPoints >= 1000) {
        discounts.push({
            code: `GOLD${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            type: 'fixed',
            value: 70,
            description: "Gold member discount",
            applicableTo: 'room_rate',
            minimumStay: 3,
            roomType: 'deluxe',
            expiresAt: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
            used: false,
            createdAt: now
        });
    }

    // Discount for users with positive reviews
    if (reviewStats.totalReviews >= 3 && reviewStats.averageRating >= 4.0) {
        discounts.push({
            code: `REVIEWER${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            type: 'percentage',
            value: 12,
            description: "Reviewer appreciation discount",
            applicableTo: 'room_rate',
            minimumStay: 2,
            roomType: 'all',
            expiresAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
            used: false,
            createdAt: now
        });
    }

    // Special occasion discount (random chance)
    if (Math.random() > 0.7) { // 30% chance
        discounts.push({
            code: `SPECIAL${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            type: 'percentage',
            value: 8,
            description: "Special promotion",
            applicableTo: 'room_rate',
            minimumStay: 1,
            roomType: 'all',
            expiresAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
            used: false,
            createdAt: now
        });
    }

    return discounts;
}

// Function to extract amenities from rooms user has booked with frequency counts
async function extractAmenitiesWithFrequency(userBookings) {
    const amenitiesCount = {};

    // Get unique room IDs from bookings
    const roomIds = [];
    userBookings.forEach(booking => {
        if (booking.room && !roomIds.includes(booking.room.toString())) {
            roomIds.push(booking.room.toString());
        }
    });

    if (roomIds.length === 0) return {};

    try {
        // Find all rooms the user has actually booked
        const rooms = await Room.find({ _id: { $in: roomIds } });

        // Count frequency of each amenity across all booked rooms
        rooms.forEach(room => {
            if (room.features && Array.isArray(room.features)) {
                room.features.forEach(amenity => {
                    if (amenity && typeof amenity === 'string' && amenity.trim()) {
                        const cleanAmenity = amenity.trim();
                        amenitiesCount[cleanAmenity] = (amenitiesCount[cleanAmenity] || 0) + 1;
                    }
                });
            }
        });

        return amenitiesCount;
    } catch (error) {
        console.error('Error extracting amenities with frequency:', error);
        return {};
    }
}

// Function to convert amenities object to sorted array by frequency (most frequent first)
function sortAmenitiesByFrequency(amenitiesObj) {
    return Object.entries(amenitiesObj)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([amenity, count]) => amenity);
}

// Run migration if script is executed directly
if (require.main === module) {
    if (!DB) {
        console.error('Database connection failed: DATABASE env var is missing.');
        process.exit(1);
    }

    mongoose.connect(DB)
        .then(() => {
            console.log('Connected to database');
            migrateExistingUsers();
        })
        .catch(err => {
            console.error('Database connection failed:', err);
            process.exit(1);
        });
}

module.exports = { migrateExistingUsers, createCRMForExistingUser };