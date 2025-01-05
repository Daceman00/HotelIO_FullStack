const express = require('express');
const roomController = require('./../controllers/roomController')

const router = express.Router();

router.route('/')
    .get(roomController.getAllRooms)
    .post(roomController.createRoom)

router.route('/:id')
    .get(roomController.getRoom)
    .patch(roomController.updateRoom)

router
    .route('/:id/images')
    .post(
        roomController.uploadRoomImages,
        roomController.resizeRoomImages,
        roomController.updateRoom // Update the room with image paths
    );

module.exports = router;