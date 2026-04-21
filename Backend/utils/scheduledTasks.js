const cron = require('node-cron');
const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const CRM = require('../models/crmModel');
const sendEmail = require('./email');
const { sendUserNotification, sendAdminNotification } = require('./socket-setup');

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

        for (const booking of unpaidBookings) {

            sendUserNotification(booking.user.id, {
                type: 'cancellation',
                title: 'Booking Cancelled! ',
                message: `Your booking for room ${booking.room.roomNumber} has been cancelled, because payment deadline has passed`,

                data: {
                    bookingId: booking._id,
                    roomNumber: booking.room.roomNumber,
                    checkIn: booking.checkIn,
                    checkOut: booking.checkOut,
                    price: booking.price
                },
                link: `/bookings?tab=missed` // Frontend route
            });
        }

        sendAdminNotification({
            type: 'booking',
            title: 'Cleanup finished',
            message: 'Cleanup task completed successfully, you can view the report on your email',
            data: {},
            link: '/bookings?tab=missed'
        })

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
    console.log('=== Starting referral success processing task ===');
    console.log(`Current date/time: ${now.toISOString()}`);

    try {
        // Find completed stays (check-out date has passed) that are paid and haven't been processed
        const eligibleBookings = await Booking.find({
            paid: 'paid',
            checkOut: { $lte: now }, // Stay is completed when check-out date has passed
            referralSuccessProcessed: { $ne: true }
        }).populate('user');

        console.log(`Found ${eligibleBookings.length} eligible bookings to process`);

        let processedCount = 0;
        let skippedNoCRM = 0;
        let skippedNoReferrer = 0;
        let skippedAlreadyAwarded = 0;

        for (const booking of eligibleBookings) {
            console.log(`\n--- Processing booking ${booking._id} ---`);
            console.log(`  Guest User ID: ${(booking.user && booking.user._id) ? booking.user._id : booking.user}`);
            console.log(`  Check-in: ${booking.checkIn}`);
            console.log(`  Check-out: ${booking.checkOut}`);
            console.log(`  Paid status: ${booking.paid}`);

            const guestUserId = booking.user && booking.user._id ? booking.user._id : booking.user;
            const guestCRM = await CRM.findOne({ user: guestUserId });

            if (!guestCRM) {
                console.log(`  ❌ No CRM entry found for user ${guestUserId}`);
                skippedNoCRM++;
                booking.referralSuccessProcessed = true;
                booking.referralSuccessProcessedAt = new Date();
                await booking.save({ validateBeforeSave: false });
                continue;
            }

            console.log(`  ✓ Guest CRM found (ID: ${guestCRM._id})`);
            console.log(`  Referred by: ${guestCRM.referredBy || 'None'}`);
            console.log(`  Referral success already awarded: ${guestCRM.referralSuccessAwarded}`);

            if (!guestCRM.referredBy) {
                console.log(`  ❌ Guest was not referred by anyone`);
                skippedNoReferrer++;
                booking.referralSuccessProcessed = true;
                booking.referralSuccessProcessedAt = new Date();
                await booking.save({ validateBeforeSave: false });
                continue;
            }

            if (guestCRM.referralSuccessAwarded) {
                console.log(`  ❌ Referral success already awarded to this guest`);
                skippedAlreadyAwarded++;
                booking.referralSuccessProcessed = true;
                booking.referralSuccessProcessedAt = new Date();
                await booking.save({ validateBeforeSave: false });
                continue;
            }

            const referrerCRM = await CRM.findOne({ user: guestCRM.referredBy });

            if (!referrerCRM) {
                console.log(`  ❌ Referrer CRM not found for user ${guestCRM.referredBy}`);
                skippedNoReferrer++;
                booking.referralSuccessProcessed = true;
                booking.referralSuccessProcessedAt = new Date();
                await booking.save({ validateBeforeSave: false });
                continue;
            }

            console.log(`  ✓ Referrer CRM found (ID: ${referrerCRM._id})`);
            console.log(`  Referrer's current points: ${referrerCRM.loyaltyPoints}`);
            console.log(`  Referrer's current successful referrals: ${referrerCRM.successfulReferrals}`);
            console.log(`  Guest's current points: ${guestCRM.loyaltyPoints}`);

            // Award points to referrer for successful referral (completed stay)
            referrerCRM.successfulReferrals += 1;
            const referrerPointsResult = await referrerCRM.addPoints(250, 'referral', `Referral bonus - booking`, booking._id);
            console.log(`  ✓ Awarded ${referrerPointsResult.awardedPoints} points to referrer. New total: ${referrerPointsResult.newTotal}`);

            // Mark guest's referral success as awarded
            guestCRM.referralSuccessAwarded = true;
            guestCRM.referralSuccessBooking = booking._id;
            const guestPointsResult = await guestCRM.addPoints(100, 'referral', 'Thanks for completing your first stay', booking._id);
            console.log(`  ✓ Awarded ${guestPointsResult.awardedPoints} points to guest. New total: ${guestPointsResult.newTotal}`);

            // Mark booking as processed
            booking.referralSuccessProcessed = true;
            booking.referralSuccessProcessedAt = new Date();
            await booking.save({ validateBeforeSave: false });
            console.log(`  ✓ Booking marked as processed`);

            processedCount += 1;
            console.log(`  ✅ Successfully processed referral for booking ${booking._id}`);

            sendUserNotification(booking.user.id, {
                type: 'referral',
                title: 'Referral processing finished',
                message: `Referral processing task completed successfully. You received ${guestPointsResult.awardedPoints} points. Previous total: ${guestPointsResult.previousTotal}. New total: ${guestPointsResult.newTotal}.`,
                data: {
                    awardedPoints: guestPointsResult.awardedPoints,
                    previousTotalPoints: guestPointsResult.previousTotal,
                    newTotalPoints: guestPointsResult.newTotal,
                    bookingId: booking._id
                },
                link: '/updateAccount'
            });

            sendUserNotification(referrerCRM.user.toString(), {
                type: 'referral',
                title: 'Referral processing finished',
                message: `Referral processing task completed successfully. You received ${referrerPointsResult.awardedPoints} points for a successful referral. Previous total: ${referrerPointsResult.previousTotal}. New total: ${referrerPointsResult.newTotal}.`,
                data: {
                    awardedPoints: referrerPointsResult.awardedPoints,
                    previousTotalPoints: referrerPointsResult.previousTotal,
                    newTotalPoints: referrerPointsResult.newTotal,
                    bookingId: booking._id,
                    successfulReferrals: referrerCRM.successfulReferrals
                },
                link: '/updateAccount'
            });
        }

        sendAdminNotification({
            type: 'referral',
            title: 'Referral processing finished',
            message: 'Referral processing task completed successfully. Users have been awarded points.',
            data: {},
            link: ''
        })

        console.log(`\n=== Referral processing task completed ===`);
        console.log(`Total eligible bookings: ${eligibleBookings.length}`);
        console.log(`Successfully processed: ${processedCount}`);
        console.log(`Skipped (no CRM): ${skippedNoCRM}`);
        console.log(`Skipped (no referrer): ${skippedNoReferrer}`);
        console.log(`Skipped (already awarded): ${skippedAlreadyAwarded}`);
    } catch (error) {
        console.error('❌ Error processing referral successes:', error.message);
        console.error('Error stack:', error.stack);
    }
};

// Schedule the cleanup task to run every day at 11:45 PM
const scheduleCleanupTask = () => {
    cron.schedule('45 11 * * *', () => {
        runCleanupTask();
    }, {
        timezone: 'Europe/Sarajevo'
    }
    );
};

// Schedule the referral processing task to run daily at midnight
const scheduleReferralProcessingTask = () => {
    cron.schedule('0 12 * * *', () => {
        processReferralSuccessesTask();
    }, {
        timezone: 'Europe/Sarajevo'
    });
};

// Export both the schedule functions and the run functions for manual execution
module.exports = {
    scheduleCleanupTask,
    runCleanupTask,
    processReferralSuccessesTask,
    scheduleReferralProcessingTask
};