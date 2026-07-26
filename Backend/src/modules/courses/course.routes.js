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



/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management APIs
 */


/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *     responses:
 *       201:
 *         description: Course created successfully
 */
router.post(
    '/',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(createCourseSchema, 'body'),
    createCourse
);



/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 */
router.get(
    '/',
    authMiddleware,
    authorizeMiddleware('student', 'instructor', 'admin'),
    validateMiddleware(getAllCoursesSchema, 'query'),
    getAllCourses
);



/**
 * @swagger
 * /courses/my:
 *   get:
 *     summary: Get instructor courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Instructor courses retrieved successfully
 */
router.get(
    '/my',
    authMiddleware,
    authorizeMiddleware('instructor'),
    validateMiddleware(getMyCoursesSchema, 'query'),
    getMyCourses
);



/**
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 */
router.get(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('student', 'instructor', 'admin'),
    validateMiddleware(getCourseByIdSchema, 'params'),
    getCourseById
);



/**
 * @swagger
 * /courses/{courseId}:
 *   patch:
 *     summary: Update course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(getCourseByIdSchema, 'params'),
    validateMiddleware(updateCourseSchema, 'body'),
    updateCourse
);



/**
 * @swagger
 * /courses/{courseId}:
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(getCourseByIdSchema, 'params'),
    deleteCourse
);



/**
 * @swagger
 * /courses/{courseId}/submit-review:
 *   patch:
 *     summary: Submit course for review
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    '/:courseId/submit-review',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(submitCourseForReviewSchema, 'params'),
    submitCourseForReview
);



/**
 * @swagger
 * /courses/{courseId}/publish:
 *   patch:
 *     summary: Publish course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    '/:courseId/publish',
    authMiddleware,
    authorizeMiddleware('admin'),
    validateMiddleware(publishCourseSchema, 'params'),
    publishCourse
);



/**
 * @swagger
 * /courses/{courseId}/unpublish:
 *   patch:
 *     summary: Unpublish course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    '/:courseId/unpublish',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(unpublishCourseSchema, 'params'),
    unpublishCourse
);



/**
 * @swagger
 * /courses/{courseId}/archive:
 *   patch:
 *     summary: Archive course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    '/:courseId/archive',
    authMiddleware,
    authorizeMiddleware('admin'),
    validateMiddleware(archiveCourseSchema, 'params'),
    archiveCourse
);



/**
 * @swagger
 * /courses/{courseId}/restore:
 *   patch:
 *     summary: Restore archived course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    '/:courseId/restore',
    authMiddleware,
    authorizeMiddleware('admin'),
    validateMiddleware(restoreArchivedCourseSchema, 'params'),
    restoreArchivedCourse
);


module.exports = router;