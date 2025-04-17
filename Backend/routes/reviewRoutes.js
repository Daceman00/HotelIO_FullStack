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
    .route('/user')
    .get(authController.protect, reviewController.getReviewsByUser);

router
    .route('/top-reviewers')
    .get(authController.protect, reviewController.getTopReviewers);

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
        authController.restrictTo('admin'),
        reviewController.deleteReview
    );

router
    .route('/room/:id')
    .get(reviewController.getReviewsByRoom);

module.exports = router;