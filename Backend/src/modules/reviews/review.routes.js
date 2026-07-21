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

//Create Review
//POST /api/v1/reviews
router.post(
    '/',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(createReviewSchema, 'body'),
    reviewController.createReview
);

//Update Review
//PATCH /api/v1/reviews/:reviewId
router.patch(
    '/:reviewId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(reviewIdParamsSchema, 'params'),
    validateMiddleware(updateReviewSchema, 'body'),
    reviewController.updateReview
);

//Delete Review
//DELETE /api/v1/reviews/:reviewId
router.delete(
    '/:reviewId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(reviewIdParamsSchema, 'params'),
    reviewController.deleteReview
);

//Get Course Reviews
//GET /api/v1/reviews/course/:courseId
router.get(
    '/course/:courseId',
    validateMiddleware(courseReviewsParamsSchema, 'params'),
    reviewController.getCourseReviews
);

//Get My Reviews
//GET /api/v1/reviews/my-reviews
router.get(
    '/my-reviews',
    authMiddleware,
    authorizeMiddleware('student'),
    reviewController.getMyReviews
);

module.exports = router;