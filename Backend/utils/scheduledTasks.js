const cron = require('node-cron');
const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');

// Function to run the cleanup task
const runCleanupTask = async () => {
    const currentDate = new Date();
    const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfToday = new Date(currentDate.setHours(23, 59, 59, 999));
    const paymentDeadline = new Date(currentDate.setHours(11, 30, 0, 0)); // Set payment deadline to 11:30 AM

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find all unpaid bookings where check-in date is today
        const unpaidBookings = await Booking.find({
            paid: 'unpaid',
            checkIn: {
                $gte: startOfToday,
                $lte: endOfToday
            },
            createdAt: { $lte: paymentDeadline } // Only process bookings that existed before the payment deadline
        }).populate('user');

        console.log(`Found ${unpaidBookings.length} unpaid bookings to process`);

        for (const booking of unpaidBookings) {
            console.log(`Processing booking ${booking._id}:`);
            console.log(`- Check-in date: ${booking.checkIn}`);
            console.log(`- Payment deadline: ${paymentDeadline}`);
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
};;

// Schedule the task to run every day at 11:45 PM
const scheduleCleanupTask = () => {
    cron.schedule('45 11 * * *', () => {
        console.log('Running scheduled cleanup task...');
        runCleanupTask();
    });
};

// Export both the schedule function and the run function for manual execution
module.exports = {
    scheduleCleanupTask,
    runCleanupTask
}; 