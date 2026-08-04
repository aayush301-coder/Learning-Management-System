const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const {
    getSectionsByCourse,
    createSection,
    updateSection,
    deleteSection,
} = require('./section.controller');

const {
    createSectionSchema,
    updateSectionSchema,
    courseIdParamsSchema,
    sectionIdParamsSchema,
} = require('./section.validation');


router.get(
    '/course/:courseId',
    validateMiddleware(courseIdParamsSchema, 'params'),
    getSectionsByCourse
);


router.post(
    '/course/:courseId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    validateMiddleware(createSectionSchema, 'body'),
    createSection
);


router.patch(
    '/:sectionId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(sectionIdParamsSchema, 'params'),
    validateMiddleware(updateSectionSchema, 'body'),
    updateSection
);


router.delete(
    '/:sectionId',
    authMiddleware,
    authorizeMiddleware('instructor', 'admin'),
    validateMiddleware(sectionIdParamsSchema, 'params'),
    deleteSection
);


module.exports = router;
