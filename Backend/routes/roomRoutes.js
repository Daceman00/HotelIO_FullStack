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
    .post(roomController.createRoomWithImages) // Use this if you want to upload images on create

router.route('/:id')
    .get(roomController.getRoomWithReviewsAndBookings)
    .patch(roomController.updateRoomWithImages) // Use this if you want to upload images on update
    .delete(roomController.deleteRoom)

router.route('/:id/active-bookings')
    .get(roomController.getRoomWithActiveBookings);

// Cover image route
router.post('/rooms/:id/cover',
    roomController.uploadRoomCover,
    roomController.processRoomCover,
    roomController.updateRoom
);

// Gallery images route
router.post('/rooms/:id/gallery',
    roomController.uploadRoomGallery,
    roomController.processRoomGallery,
    roomController.updateRoom
);
module.exports = router;