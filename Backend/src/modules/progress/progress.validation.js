const { z } = require('zod');
const { objectIdSchema } = require('../../utils/zodSchemas');

const completeLessonParamsSchema = z.object({
    courseId: objectIdSchema,
    lessonId: objectIdSchema,
});

const lastAccessedParamsSchema = z.object({
    courseId: objectIdSchema,
});

const lastAccessedBodySchema = z.object({
    lessonId: objectIdSchema,
});

const courseProgressParamsSchema = z.object({
    courseId: objectIdSchema,
});

module.exports = {
    completeLessonParamsSchema,
    lastAccessedParamsSchema,
    lastAccessedBodySchema,
    courseProgressParamsSchema,
};
