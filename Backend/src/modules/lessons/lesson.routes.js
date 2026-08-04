const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const {
    getLessonsBySection,
    createLesson,
    updateLesson,
    deleteLesson,
} = require('./lesson.controller');

const {
    createLessonSchema,
    updateLessonSchema,
    sectionIdParamsSchema,
    lessonIdParamsSchema,
} = require('./lesson.validation');


router.get(
    '/section/:sectionId',
    validateMiddleware(sectionIdParamsSchema, 'params'),
    getLessonsBySection
);


router.post(
    '/section/:sectionId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(sectionIdParamsSchema, 'params'),
    validateMiddleware(createLessonSchema, 'body'),
    createLesson
);


router.patch(
    '/:lessonId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(lessonIdParamsSchema, 'params'),
    validateMiddleware(updateLessonSchema, 'body'),
    updateLesson
);


router.delete(
    '/:lessonId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(lessonIdParamsSchema, 'params'),
    deleteLesson
);


module.exports = router;
