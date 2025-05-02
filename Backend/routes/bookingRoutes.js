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
    .route('/user')
    .get(bookingController.getBookingsByUser);

router
    .route('/user/booking-counts')
    .get(bookingController.getUserBookingCounts);

router
    .route('/booking-counts')
    .get(bookingController.getBookingCounts);

router
    .route('/room-booking-counts')
    .get(bookingController.getRoomBookingCounts);

router
    .route('/top-bookers')
    .get(authController.restrictTo("admin"), bookingController.getTopBookers);

router
    .route('/top-spenders')
    .get(authController.restrictTo("admin"), bookingController.getTopSpenders);

router
    .route('/total-revenue',)
    .get(authController.restrictTo("admin"), bookingController.getTotalRevenue);

router
    .route('/monthly-bookings/:year')
    .get(bookingController.getMonthlyBookings);

router
    .route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

router
    .route('/:id/pay')
    .patch(authController.restrictTo('user', 'admin'), bookingController.markBookingAsPaid);

router
    .route('/room/:id')
    .get(bookingController.getBookingsByRoom);

module.exports = router;
