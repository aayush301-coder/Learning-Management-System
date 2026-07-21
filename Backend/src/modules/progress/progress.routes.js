const express = require('express');
const router = express.Router();
const progressController = require('./progress.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const {
    completeLessonParamsSchema,
    lastAccessedParamsSchema,
    lastAccessedBodySchema,
    courseProgressParamsSchema,
} = require('./progress.validation');

// Complete lesson
router.patch('/:courseId/lesson/:lessonId/complete', authMiddleware, authorizeMiddleware('student'), validateMiddleware(completeLessonParamsSchema, 'params'), progressController.completeLesson);

// Update last accessed lesson
router.patch('/:courseId/last-accessed', authMiddleware, authorizeMiddleware('student'), validateMiddleware(lastAccessedParamsSchema, 'params'), validateMiddleware(lastAccessedBodySchema, 'body'), progressController.updateLastAccessedLesson);

// Get student's progress
router.get('/my-progress', authMiddleware, authorizeMiddleware('student'), progressController.getStudentProgress);

// Get course progress
router.get('/:courseId', authMiddleware, authorizeMiddleware('student'), validateMiddleware(courseProgressParamsSchema, 'params'), progressController.getCourseProgress);

module.exports = router;