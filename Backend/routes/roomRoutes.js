const express = require('express');
const roomController = require('./../controllers/roomController')
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const bookingRouter = require('./bookingRoutes');

const router = express.Router();

router.use(authController.protect)
// router.use(authController.restrictTo('admin'))

router.use('/:roomId/reviews', reviewRouter);
router.use('/:roomId/bookings', bookingRouter);

router.route('/')
    .get(roomController.getAllRooms)
    .post(roomController.createRoom)

router.route('/:id')
    .get(roomController.getRoomWithReviews)
    .patch(roomController.updateRoom)
    .delete(roomController.deleteRoom)

router
    .route('/:id/images')
    .post(
        roomController.uploadRoomImages,
        roomController.resizeRoomImages,
        roomController.updateRoom // Update the room with image paths
    );

module.exports = router;