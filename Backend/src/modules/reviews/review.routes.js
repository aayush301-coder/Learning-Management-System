const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const {
    getReviewsByCourse,
    createReview,
    updateReview,
    deleteReview,
} = require('./review.controller');

const {
    createReviewSchema,
    updateReviewSchema,
    courseIdParamsSchema,
    reviewIdParamsSchema,
} = require('./review.validation');


router.get(
    '/course/:courseId',
    validateMiddleware(courseIdParamsSchema, 'params'),
    getReviewsByCourse
);


router.post(
    '/course/:courseId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    validateMiddleware(createReviewSchema, 'body'),
    createReview
);


router.patch(
    '/:reviewId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(reviewIdParamsSchema, 'params'),
    validateMiddleware(updateReviewSchema, 'body'),
    updateReview
);


router.delete(
    '/:reviewId',
    authMiddleware,
    authorizeMiddleware('student', 'admin'),
    validateMiddleware(reviewIdParamsSchema, 'params'),
    deleteReview
);


module.exports = router;
