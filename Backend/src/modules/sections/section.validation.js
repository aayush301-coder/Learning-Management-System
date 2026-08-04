const { z } = require('zod');


const createSectionSchema = z.object({

    title: z
        .string()
        .trim()
        .min(3, 'Title must be at least 3 characters')
        .max(150, 'Title cannot exceed 150 characters'),

    order: z.coerce
        .number()
        .min(0, 'Order cannot be negative')
        .default(0),

});


const updateSectionSchema = createSectionSchema.partial();


const courseIdParamsSchema = z.object({

    courseId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid course id'),

});


const sectionIdParamsSchema = z.object({

    sectionId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid section id'),

});


module.exports = {
    createSectionSchema,
    updateSectionSchema,
    courseIdParamsSchema,
    sectionIdParamsSchema,
};
