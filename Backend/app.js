const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const userRouter = require('./routes/userRoutes');
const roomRouter = require('./routes/roomRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const AppError = require('./utils/appError');
const { runCleanupTask } = require('./utils/scheduledTasks');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public/img`));
app.use(cors())

app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// 2. ADD CLEANUP ENDPOINT HERE (BEFORE MAIN ROUTES)
app.get('/cron/cleanup-bookings', async (req, res, next) => {
    // Verify secret key
    if (req.query.secret !== process.env.CRON_SECRET) {
        return res.status(403).json({
            status: 'error',
            message: 'Invalid cron secret'
        });
    }

    try {
        console.log(`[${new Date().toISOString()}] Cleanup triggered via cron endpoint`);
        await runCleanupTask();
        res.json({
            status: 'success',
            message: 'Cleanup completed successfully'
        });
    } catch (error) {
        console.error('Cron endpoint error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Cleanup task failed'
        });
    }
});

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/payments', paymentRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;