const cron = require('node-cron');
const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const CRM = require('../models/crmModel');
const sendEmail = require('./email');

// Function to run the cleanup task
const runCleanupTask = async () => {
    const currentDate = new Date();
    // Create new dates to avoid mutation issues
    const startOfToday = new Date(currentDate);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(currentDate);
    endOfToday.setHours(23, 59, 59, 999);

    const paymentDeadline = new Date(currentDate);
    paymentDeadline.setHours(11, 30, 0, 0); // Set payment deadline to 11:30 AM

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


        for (const booking of unpaidBookings) {

            // Mark the booking as missed
            booking.paid = 'missed';
            await booking.save({ session });

        }

        await session.commitTransaction();

        // Moved email sending inside try block after transaction commit
        if (process.env.ADMIN_EMAIL) {
            const totalAmount = unpaidBookings.reduce((sum, b) => sum + b.price, 0);
            const subject = `Booking Cleanup Report - ${new Date().toLocaleDateString()}`;

            // HTML version of the report
            let html = `
            <h1 style="color: #333; font-family: Arial, sans-serif;">Booking Cleanup Report</h1>
            <p style="font-family: Arial, sans-serif;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p style="font-family: Arial, sans-serif;"><strong>Total missed bookings:</strong> ${unpaidBookings.length}</p>
            <p style="font-family: Arial, sans-serif;"><strong>Total amount:</strong> $${totalAmount.toFixed(2)}</p>
            `;

            html += `<h2 style="font-family: Arial, sans-serif;">Details:</h2>
                     <table border="1" cellpadding="8" style="border-collapse: collapse; font-family: Arial, sans-serif; margin-bottom: 20px;">
                     <tr style="background-color: #f2f2f2;">
                         <th>#</th>
                         <th>Booking ID</th>
                         <th>User</th>
                         <th>Room</th>
                         <th>Price</th>
                         <th>Check-in</th>
                         <th>Check-out</th>
                     </tr>`;

            unpaidBookings.forEach((booking, index) => {
                html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${booking._id}</td>
                    <td>${booking.user.email}</td>
                    <td>${booking.room.roomNumber}</td>
                    <td>$${booking.price.toFixed(2)}</td>
                    <td>${booking.checkIn.toISOString().split('T')[0]}</td>
                    <td>${booking.checkOut.toISOString().split('T')[0]}</td>
                </tr>`;
            });

            html += `</table>`;

            // Plain text version of the report
            let textReport = `Booking Cleanup Report\n`;
            textReport += `Date: ${new Date().toLocaleString()}\n`;
            textReport += `Total missed bookings: ${unpaidBookings.length}\n`;
            textReport += `Total amount: $${totalAmount.toFixed(2)}\n\n`;
            textReport += `Details:\n`;
            unpaidBookings.forEach((booking, index) => {
                textReport += `${index + 1}. Booking ID: ${booking._id}, User: ${booking.user.email}, Room: ${booking.room}, Price: $${booking.price.toFixed(2)}, Check-in: ${booking.checkIn.toISOString().split('T')[0]}\n`;
            });

            // Assign html to htmlReport for clarity
            const htmlReport = html;

            // Send email with HTML content
            try {
                await sendEmail({
                    email: process.env.ADMIN_EMAIL,
                    subject: subject, // use the subject variable here
                    message: textReport,
                    html: htmlReport
                });
            } catch (emailError) {
                console.error('Failed to send report email:', emailError);
            }
        } else if (unpaidBookings.length === 0) {
        }
    } catch (error) {
        await session.abortTransaction();
        console.error('Error running cleanup task:', error.message);
    } finally {
        session.endSession();
    }
};
// Function to process referral successes when stays are completed
const processReferralSuccessesTask = async () => {
    const now = new Date();

    try {
        // Find completed stays (check-out date has passed) that are paid and haven't been processed
        const eligibleBookings = await Booking.find({
            paid: 'paid',
            checkOut: { $lte: now }, // Stay is completed when check-out date has passed
            referralSuccessProcessed: { $ne: true }
        }).populate('user');

        let processedCount = 0;

        for (const booking of eligibleBookings) {
            const guestUserId = booking.user && booking.user._id ? booking.user._id : booking.user;
            const guestCRM = await CRM.findOne({ user: guestUserId });

            if (!guestCRM || !guestCRM.referredBy || guestCRM.referralSuccessAwarded) {
                booking.referralSuccessProcessed = true;
                booking.referralSuccessProcessedAt = new Date();
                await booking.save({ validateBeforeSave: false });
                continue;
            }

            const referrerCRM = await CRM.findOne({ user: guestCRM.referredBy });

            if (!referrerCRM) {
                booking.referralSuccessProcessed = true;
                booking.referralSuccessProcessedAt = new Date();
                await booking.save({ validateBeforeSave: false });
                continue;
            }

            // Award points to referrer for successful referral (completed stay)
            referrerCRM.successfulReferrals += 1;
            await referrerCRM.addPoints(250, 'referral', `Referral bonus - booking ${booking._id}`);

            // Mark guest's referral success as awarded
            guestCRM.referralSuccessAwarded = true;
            guestCRM.referralSuccessBooking = booking._id;
            await guestCRM.addPoints(100, 'referral', 'Thanks for completing your first stay');

            // Mark booking as processed
            booking.referralSuccessProcessed = true;
            booking.referralSuccessProcessedAt = new Date();
            await booking.save({ validateBeforeSave: false });

            processedCount += 1;
        }

        if (processedCount > 0) {
            console.log(`Processed ${processedCount} referral successes`);
        }
    } catch (error) {
        console.error('Error processing referral successes:', error.message);
    }
};

// Schedule the cleanup task to run every day at 11:45 PM
const scheduleCleanupTask = () => {
    cron.schedule('45 11 * * *', () => {
        runCleanupTask();
    });
};

// Schedule the referral processing task to run daily at midnight
const scheduleReferralProcessingTask = () => {
    cron.schedule('0 12 * * *', () => {
        processReferralSuccessesTask();
    });
};

// Export both the schedule functions and the run functions for manual execution
module.exports = {
    scheduleCleanupTask,
    runCleanupTask,
    processReferralSuccessesTask,
    scheduleReferralProcessingTask
};