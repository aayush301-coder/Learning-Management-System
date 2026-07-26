const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const {
    createCourse,
    getAllCourses,
    getMyCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    submitCourseForReview,
    publishCourse,
    unpublishCourse,
    archiveCourse,
    restoreArchivedCourse,
} = require('./course.controller');


const {
    createCourseSchema,
    updateCourseSchema,
    getAllCoursesSchema,
    getMyCoursesSchema,
    getCourseByIdSchema,
    submitCourseForReviewSchema,
    publishCourseSchema,
    unpublishCourseSchema,
    archiveCourseSchema,
    restoreArchivedCourseSchema,
} = require('./course.validation');


// Create Course
router.post(
    '/',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(createCourseSchema, 'body'),
    createCourse
);


// Get All Courses
router.get(
    '/',
    authMiddleware,
    authorizeMiddleware('student', 'instructor', 'admin'),
    validateMiddleware(getAllCoursesSchema, 'query'),
    getAllCourses
);


// Get Instructor Courses
router.get(
    '/my',
    authMiddleware,
    authorizeMiddleware('instructor'),
    validateMiddleware(getMyCoursesSchema, 'query'),
    getMyCourses
);


// Get Course By ID
router.get(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('student', 'instructor', 'admin'),
    validateMiddleware(getCourseByIdSchema, 'params'),
    getCourseById
);


// Update Course
router.patch(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(getCourseByIdSchema, 'params'),
    validateMiddleware(updateCourseSchema, 'body'),
    updateCourse
);


// Delete Course
router.delete(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(getCourseByIdSchema, 'params'),
    deleteCourse
);


// Submit Course For Review
router.patch(
    '/:courseId/submit-review',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(submitCourseForReviewSchema, 'params'),
    submitCourseForReview
);


// Publish Course
router.patch(
    '/:courseId/publish',
    authMiddleware,
    authorizeMiddleware('admin'),
    validateMiddleware(publishCourseSchema, 'params'),
    publishCourse
);


// Unpublish Course
router.patch(
    '/:courseId/unpublish',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(unpublishCourseSchema, 'params'),
    unpublishCourse
);


// Archive Course
router.patch(
    '/:courseId/archive',
    authMiddleware,
    authorizeMiddleware('admin'),
    validateMiddleware(archiveCourseSchema, 'params'),
    archiveCourse
);


// Restore Course
router.patch(
    '/:courseId/restore',
    authMiddleware,
    authorizeMiddleware('admin'),
    validateMiddleware(restoreArchivedCourseSchema, 'params'),
    restoreArchivedCourse
);


module.exports = router;