const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .get(bookingController.getAllBookings)
    .post(
        authController.restrictTo('user'),
        bookingController.setRoomUserIds,
        bookingController.createBooking
    );

router
    .route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

router
    .route('/user/:id')
    .get(bookingController.getBookingsByUser);

module.exports = router;
