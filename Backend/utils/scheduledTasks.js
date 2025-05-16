const cron = require('node-cron');
const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');

// Function to run the cleanup task
const runCleanupTask = async () => {
    const currentDate = new Date();
    currentDate.setHours(12, 0, 0, 0); // Set to noon for check-in time

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find all unpaid bookings where check-in date is today or in the past
        const unpaidBookings = await Booking.find({
            paid: 'unpaid',
            checkIn: { $lte: currentDate }
        }).populate('user');

        console.log(`Found ${unpaidBookings.length} unpaid bookings to process`);

        for (const booking of unpaidBookings) {
            console.log(`Processing booking ${booking._id}:`);
            console.log(`- Check-in date: ${booking.checkIn}`);
            console.log(`- User: ${booking.user.email}`);
            console.log(`- Room: ${booking.room}`);
            console.log(`- Price: $${booking.price}`);

            // Mark the booking as missed
            booking.paid = 'missed';
            await booking.save({ session });

            console.log(`Successfully marked booking ${booking._id} as missed`);
        }

        await session.commitTransaction();
        console.log(`Cleanup task completed. Marked ${unpaidBookings.length} bookings as missed`);
    } catch (error) {
        await session.abortTransaction();
        console.error('Error running cleanup task:', error.message);
    } finally {
        session.endSession();
    }
};

// Schedule the task to run every day at 12:00 PM
const scheduleCleanupTask = () => {
    cron.schedule('0 12 * * *', () => {
        console.log('Running scheduled cleanup task...');
        runCleanupTask();
    });
};

// Export both the schedule function and the run function for manual execution
module.exports = {
    scheduleCleanupTask,
    runCleanupTask
}; 