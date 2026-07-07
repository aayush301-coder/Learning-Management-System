const express = require('express');
const router = express.Router();
const sectionController = require('./section.controller');
const validateMiddleware = require('../../middlewares/validate.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const {createSectionSchema, updateSectionSchema, courseIdSchema, sectionIdSchema} = require('./section.validation');

router.post('/courses/:courseId/sections', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(courseIdSchema, 'params'), validateMiddleware(createSectionSchema), sectionController.createSection);

router.get('/courses/:courseId/sections', authMiddleware, validateMiddleware(courseIdSchema, 'params'), sectionController.getSectionsByCourse);

router.get('/sections/:sectionId', authMiddleware, validateMiddleware(sectionIdSchema, 'params'), sectionController.getSectionById);

router.patch('/sections/:sectionId', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(sectionIdSchema, 'params'), validateMiddleware(updateSectionSchema), sectionController.updateSection);

router.delete('/sections/:sectionId', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(sectionIdSchema, 'params'), sectionController.deleteSection);

module.exports = router;
