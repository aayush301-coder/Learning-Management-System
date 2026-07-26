const express = require('express');
const router = express.Router();
const sectionController = require('./section.controller');
const validateMiddleware = require('../../middlewares/validate.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const {createSectionSchema, updateSectionSchema, courseIdSchema, sectionIdSchema} = require('./section.validation');

/**
 * @swagger
 * /courses/{courseId}/sections:
 *   post:
 *     summary: Create section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 */
router.post('/courses/:courseId/sections', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(courseIdSchema, 'params'), validateMiddleware(createSectionSchema), sectionController.createSection);

/**
 * @swagger
 * /courses/{courseId}/sections:
 *   get:
 *     summary: Get sections by course
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 */
router.get('/courses/:courseId/sections', authMiddleware, validateMiddleware(courseIdSchema, 'params'), sectionController.getSectionsByCourse);

/**
 * @swagger
 * /sections/{sectionId}:
 *   get:
 *     summary: Get section by ID
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 */
router.get('/sections/:sectionId', authMiddleware, validateMiddleware(sectionIdSchema, 'params'), sectionController.getSectionById);

/**
 * @swagger
 * /sections/{sectionId}:
 *   patch:
 *     summary: Update section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 */
router.get('/sections/:sectionId', authMiddleware, validateMiddleware(sectionIdSchema, 'params'), sectionController.getSectionById);

/**
 * @swagger
 * /sections/{sectionId}:
 *   patch:
 *     summary: Update section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/sections/:sectionId', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(sectionIdSchema, 'params'), validateMiddleware(updateSectionSchema), sectionController.updateSection);

/**
 * @swagger
 * /sections/{sectionId}:
 *   delete:
 *     summary: Delete section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/sections/:sectionId', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(sectionIdSchema, 'params'), sectionController.deleteSection);

module.exports = router;
