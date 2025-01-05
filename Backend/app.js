const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const userRouter = require('./routes/userRoutes');
const roomRouter = require('./routes/roomRoutes');
const AppError = require('./utils/appError');

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

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/rooms', roomRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;