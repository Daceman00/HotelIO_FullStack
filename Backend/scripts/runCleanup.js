require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { runCleanupTask } = require('../utils/scheduledTasks');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB)
    .then(() => {
        return runCleanupTask();
    })
    .then(() => {
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    }); 