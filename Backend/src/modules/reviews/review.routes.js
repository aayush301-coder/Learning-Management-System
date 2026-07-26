const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const {
    createReviewSchema,
    updateReviewSchema,
    courseReviewsParamsSchema,
    reviewIdParamsSchema,
} = require('./review.validation');

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.post(
    '/',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(createReviewSchema, 'body'),
    reviewController.createReview
);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   patch:
 *     summary: Update review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    '/:reviewId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(reviewIdParamsSchema, 'params'),
    validateMiddleware(updateReviewSchema, 'body'),
    reviewController.updateReview
);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
    '/:reviewId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(reviewIdParamsSchema, 'params'),
    reviewController.deleteReview
);

/**
 * @swagger
 * /reviews/course/{courseId}:
 *   get:
 *     summary: Get course reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    '/course/:courseId',
    validateMiddleware(courseReviewsParamsSchema, 'params'),
    reviewController.getCourseReviews
);

/**
 * @swagger
 * /reviews/my-reviews:
 *   get:
 *     summary: Get student's reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    '/my-reviews',
    authMiddleware,
    authorizeMiddleware('student'),
    reviewController.getMyReviews
);

module.exports = router;