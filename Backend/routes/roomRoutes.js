const express = require('express');
const roomController = require('./../controllers/roomController')
const reviewRouter = require('./reviewRoutes');
const bookingRouter = require('./bookingRoutes');

const router = express.Router();

// router.use(authController.protect)
// router.use(authController.restrictTo('admin'))

router.use('/:roomId/reviews', reviewRouter);
router.use('/:roomId/bookings', bookingRouter);

router.route('/')
    .get(roomController.getAllRooms)

router.route('/:id')
    .get(roomController.getRoomWithReviewsAndBookings)
    .delete(roomController.deleteRoom)

router.route('/:id/active-bookings')
    .get(roomController.getRoomWithActiveBookings);


router.route('/:id/cover')
    .patch(
        roomController.uploadRoomCover,
        roomController.processRoomCover,
        roomController.updateRoom
    );

router.route('/:id/gallery')
    .patch(
        roomController.uploadRoomGallery,
        roomController.processRoomGallery,
        roomController.updateRoom
    );

module.exports = router;