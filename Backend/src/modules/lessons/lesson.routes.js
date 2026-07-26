const express = require('express');
const router = express.Router();
const lessonController = require('./lesson.controller');
const validateMiddleware = require('../../middlewares/validate.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const {createLessonSchema, updateLessonSchema, sectionIdSchema, lessonIdSchema} = require('./lesson.validation');

/**
 * @swagger
 * /sections/{sectionId}/lessons:
 *   post:
 *     summary: Create lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 */
router.post('/sections/:sectionId/lessons', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(sectionIdSchema, 'params'), validateMiddleware(createLessonSchema), lessonController.createLesson);

/**
 * @swagger
 * /sections/{sectionId}/lessons:
 *   get:
 *     summary: Get lessons by section
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 */
router.get('/sections/:sectionId/lessons', authMiddleware, validateMiddleware(sectionIdSchema, 'params'), lessonController.getLessonsBySection);

/**
 * @swagger
 * /lessons/{lessonId}:
 *   get:
 *     summary: Get lesson by ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 */
router.get('/lessons/:lessonId', authMiddleware, validateMiddleware(lessonIdSchema, 'params'), lessonController.getLessonById);

/**
 * @swagger
 * /lessons/{lessonId}:
 *   patch:
 *     summary: Update lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/lessons/:lessonId', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(lessonIdSchema, 'params'), validateMiddleware(updateLessonSchema), lessonController.updateLesson);

/**
 * @swagger
 * /lessons/{lessonId}:
 *   delete:
 *     summary: Delete lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/lessons/:lessonId', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(lessonIdSchema, 'params'), lessonController.deleteLesson);

module.exports = router;
