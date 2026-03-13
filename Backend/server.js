process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err.message);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const { scheduleCleanupTask, scheduleReferralProcessingTask } = require('./utils/scheduledTasks');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB)
    .then(() => {
        // Initialize scheduled tasks after DB connection is established
        scheduleCleanupTask();
        scheduleReferralProcessingTask();
    });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
    process.exit(1);
});