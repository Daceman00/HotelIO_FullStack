const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const reviewEligibility = require('./../middlewares/reviewEligibility');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewEligibility.checkReviewEligibility,
        reviewController.setRoomUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.protect,
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview
    )
    .delete(
        authController.protect,
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    );

router
    .route('/user/:id')
    .get(reviewController.getReviewsByUser);

router
    .route('/room/:id')
    .get(reviewController.getReviewsByRoom);

module.exports = router;