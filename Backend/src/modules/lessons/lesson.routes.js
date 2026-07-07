const express = require('express');
const router = express.Router();
const lessonController = require('./lesson.controller');
const validateMiddleware = require('../../middlewares/validate.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const {createLessonSchema, updateLessonSchema, sectionIdSchema, lessonIdSchema} = require('./lesson.validation');

router.post('/sections/:sectionId/lessons', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(sectionIdSchema, 'params'), validateMiddleware(createLessonSchema), lessonController.createLesson);

router.get('/sections/:sectionId/lessons', authMiddleware, validateMiddleware(sectionIdSchema, 'params'), lessonController.getLessonsBySection);

router.get('/lessons/:lessonId', authMiddleware, validateMiddleware(lessonIdSchema, 'params'), lessonController.getLessonById);

router.patch('/lessons/:lessonId', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(lessonIdSchema, 'params'), validateMiddleware(updateLessonSchema), lessonController.updateLesson);

router.delete('/lessons/:lessonId', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(lessonIdSchema, 'params'), lessonController.deleteLesson);

module.exports = router;
