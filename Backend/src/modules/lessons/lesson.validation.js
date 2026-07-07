const { z } = require('zod');

const createLessonSchema = z.object({
    title: z.string().min(1).trim(),
    description: z.string().optional(),
    videoUrl: z.string().trim().optional(),
    duration: z.number().int().nonnegative().optional(),
    isPreview: z.boolean().optional(),
});

const updateLessonSchema = z.object({
    title: z.string().min(1).trim().optional(),
    description: z.string().optional(),
    order: z.number().int().positive().optional(),
    videoUrl: z.string().trim().url().optional(),
    duration: z.number().int().nonnegative().optional(),
    isPreview: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0);

const sectionIdSchema = z.object({
    sectionId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

const lessonIdSchema = z.object({
    lessonId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

module.exports = {
    createLessonSchema,
    updateLessonSchema,
    sectionIdSchema,
    lessonIdSchema
};
