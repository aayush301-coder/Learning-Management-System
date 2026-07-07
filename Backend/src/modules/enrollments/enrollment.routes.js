const express = require('express');
const router = express.Router();
const enrollmentController = require('./enrollment.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { getCourseByIdSchema } = require('./enrollment.validation');

// Enroll in a course
router.post('/courses/:courseId/enroll', authMiddleware, authorizeMiddleware('student'), validateMiddleware(getCourseByIdSchema, 'params'), enrollmentController.enrollInCourse);

// Get my enrollments
router.get('/enrollments/me', authMiddleware, authorizeMiddleware('student'), enrollmentController.getMyEnrollments);

// Cancel an enrollment
router.delete('/courses/:courseId/enroll', authMiddleware, authorizeMiddleware('student'), validateMiddleware(getCourseByIdSchema, 'params'), enrollmentController.cancelEnrollment);

module.exports = router;
