const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const optionalAuthMiddleware = require('../../middlewares/optionalAuth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const {
    getAllCourses,
    getMyCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    submitForReview,
    publishCourse,
    unpublishCourse,
    archiveCourse,
    restoreArchivedCourse,
} = require('./course.controller');

const {
    createCourseSchema,
    updateCourseSchema,
    getAllCoursesSchema,
    courseIdParamsSchema,
} = require('./course.validation');


router.get(
    '/',
    optionalAuthMiddleware,
    validateMiddleware(getAllCoursesSchema, 'query'),
    getAllCourses
);


router.get(
    '/my-courses',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(getAllCoursesSchema, 'query'),
    getMyCourses
);


router.get(
    '/:courseId',
    optionalAuthMiddleware,
    validateMiddleware(courseIdParamsSchema, 'params'),
    getCourseById
);


router.post(
    '/',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(createCourseSchema, 'body'),
    createCourse
);


router.patch(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    validateMiddleware(updateCourseSchema, 'body'),
    updateCourse
);


router.delete(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    deleteCourse
);


router.patch(
    '/:courseId/submit-for-review',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    submitForReview
);


router.patch(
    '/:courseId/publish',
    authMiddleware,
    authorizeMiddleware('admin'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    publishCourse
);


router.patch(
    '/:courseId/unpublish',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    unpublishCourse
);


router.patch(
    '/:courseId/archive',
    authMiddleware,
    authorizeMiddleware('admin'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    archiveCourse
);


router.patch(
    '/:courseId/restore',
    authMiddleware,
    authorizeMiddleware('admin'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    restoreArchivedCourse
);


module.exports = router;
