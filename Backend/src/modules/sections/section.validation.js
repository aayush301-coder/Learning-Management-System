const { z } = require('zod');

const createSectionSchema = z.object({
    title: z.string().min(1).trim(),
    description: z.string().optional(),
});

const updateSectionSchema = z.object({
    title: z.string().min(1).trim().optional(),
    description: z.string().optional(),
    order: z.number().int().positive().optional(),
}).refine(data => Object.keys(data).length > 0);

const courseIdSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

const sectionIdSchema = z.object({
    sectionId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

module.exports = {
    createSectionSchema,
    updateSectionSchema,
    courseIdSchema,
    sectionIdSchema
};