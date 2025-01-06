const express = require('express');
const roomController = require('./../controllers/roomController')
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect)
router.use(authController.restrictTo('admin'))

router.route('/')
    .get(roomController.getAllRooms)
    .post(roomController.createRoom)

router.route('/:id')
    .get(roomController.getRoom)
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