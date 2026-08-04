const { z } = require('zod');


const courseProgressParamsSchema = z.object({

    courseId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid course id'),

});


const completeLessonParamsSchema = z.object({

    courseId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid course id'),

    lessonId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid lesson id'),

});


const lastAccessedParamsSchema = z.object({

    courseId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid course id'),

});


const lastAccessedBodySchema = z.object({

    lessonId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid lesson id'),

});


module.exports = {
    courseProgressParamsSchema,
    completeLessonParamsSchema,
    lastAccessedParamsSchema,
    lastAccessedBodySchema,
};
