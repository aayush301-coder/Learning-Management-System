const { z } = require('zod');


const createReviewSchema = z.object({

    rating: z.coerce
        .number()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5'),

    comment: z
        .string()
        .trim()
        .max(1000, 'Comment cannot exceed 1000 characters')
        .optional(),

});


const updateReviewSchema = createReviewSchema.partial();


const courseIdParamsSchema = z.object({

    courseId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid course id'),

});


const reviewIdParamsSchema = z.object({

    reviewId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid review id'),

});


module.exports = {
    createReviewSchema,
    updateReviewSchema,
    courseIdParamsSchema,
    reviewIdParamsSchema,
};
