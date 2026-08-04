const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const {
    completeLesson,
    updateLastAccessedLesson,
    getCourseProgress,
    getStudentProgress,
} = require('./progress.controller');

const {
    courseProgressParamsSchema,
    completeLessonParamsSchema,
    lastAccessedParamsSchema,
    lastAccessedBodySchema,
} = require('./progress.validation');


// NOTE: this static route must stay registered before the dynamic
// "/:courseId" route below, otherwise Express would match
// "/my-progress" as if "my-progress" were a courseId.
router.get(
    '/my-progress',
    authMiddleware,
    authorizeMiddleware('student'),
    getStudentProgress
);


router.patch(
    '/:courseId/lesson/:lessonId/complete',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(completeLessonParamsSchema, 'params'),
    completeLesson
);


router.patch(
    '/:courseId/last-accessed',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(lastAccessedParamsSchema, 'params'),
    validateMiddleware(lastAccessedBodySchema, 'body'),
    updateLastAccessedLesson
);


router.get(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(courseProgressParamsSchema, 'params'),
    getCourseProgress
);


module.exports = router;
