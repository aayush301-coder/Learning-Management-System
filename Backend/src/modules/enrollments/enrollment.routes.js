const express = require('express');
const router = express.Router();
const enrollmentController = require('./enrollment.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { getCourseByIdSchema } = require('./enrollment.validation');

/**
 * @swagger
 * /courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/courses/:courseId/enroll', authMiddleware, authorizeMiddleware('student'), validateMiddleware(getCourseByIdSchema, 'params'), enrollmentController.enrollInCourse);

/**
 * @swagger
 * /enrollments/me:
 *   get:
 *     summary: Get my enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/enrollments/me', authMiddleware, authorizeMiddleware('student'), enrollmentController.getMyEnrollments);

/**
 * @swagger
 * /enrollments/{enrollmentId}:
 *   delete:
 *     summary: Cancel an enrollment
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/courses/:courseId/enroll', authMiddleware, authorizeMiddleware('student'), validateMiddleware(getCourseByIdSchema, 'params'), enrollmentController.cancelEnrollment);

module.exports = router;
