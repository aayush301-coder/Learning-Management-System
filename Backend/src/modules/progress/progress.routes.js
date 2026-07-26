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

/**
 * @swagger
 * /progress/{courseId}:
 *   get:
 *     summary: Get student's progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:courseId', authMiddleware, authorizeMiddleware('student'), progressController.getStudentProgress);

/**
 * @swagger
 * /progress/{courseId}/lesson/{lessonId}/complete:
 *   patch:
 *     summary: Complete lesson
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:courseId/lesson/:lessonId/complete', authMiddleware, authorizeMiddleware('student'), validateMiddleware(completeLessonParamsSchema, 'params'), progressController.completeLesson);

/**
 * @swagger
 * /progress/{courseId}/last-accessed:
 *   patch:
 *     summary: Update last accessed lesson
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:courseId/last-accessed', authMiddleware, authorizeMiddleware('student'), validateMiddleware(lastAccessedParamsSchema, 'params'), validateMiddleware(lastAccessedBodySchema, 'body'), progressController.updateLastAccessedLesson);

/**
 * @swagger
 * /progress/{courseId}:
 *   get:
 *     summary: Get student's progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-progress', authMiddleware, authorizeMiddleware('student'), progressController.getStudentProgress);

/**
 * @swagger
 * /progress/{courseId}:
 *   get:
 *     summary: Get course progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:courseId', authMiddleware, authorizeMiddleware('student'), validateMiddleware(courseProgressParamsSchema, 'params'), progressController.getCourseProgress);

module.exports = router;