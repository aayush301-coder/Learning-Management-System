const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const {
    enrollInCourse,
    getMyEnrollments,
    cancelEnrollment,
} = require('./enrollment.controller');

const { courseIdParamsSchema } = require('./enrollment.validation');


router.get(
    '/my-enrollments',
    authMiddleware,
    authorizeMiddleware('student'),
    getMyEnrollments
);


router.post(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    enrollInCourse
);


router.delete(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    cancelEnrollment
);


module.exports = router;
