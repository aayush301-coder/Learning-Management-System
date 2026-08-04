const { z } = require('zod');


const createLessonSchema = z.object({

    title: z
        .string()
        .trim()
        .min(3, 'Title must be at least 3 characters')
        .max(150, 'Title cannot exceed 150 characters'),

    description: z
        .string()
        .trim()
        .optional(),

    videoUrl: z
        .string()
        .trim()
        .url('Invalid video URL')
        .optional(),

    duration: z.coerce
        .number()
        .min(0, 'Duration cannot be negative')
        .default(0),

    order: z.coerce
        .number()
        .min(0, 'Order cannot be negative')
        .default(0),

    isPreview: z.coerce
        .boolean()
        .default(false),

});


const updateLessonSchema = createLessonSchema.partial();


const sectionIdParamsSchema = z.object({

    sectionId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid section id'),

});


const lessonIdParamsSchema = z.object({

    lessonId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid lesson id'),

});


module.exports = {
    createLessonSchema,
    updateLessonSchema,
    sectionIdParamsSchema,
    lessonIdParamsSchema,
};
