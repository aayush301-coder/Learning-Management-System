const { z } = require('zod');

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');


const createReviewSchema = z.object({
    courseId: objectIdSchema,
    rating: z
        .coerce
        .number()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5'),
    review: z
        .string()
        .trim()
        .max(1000, 'Review cannot exceed 1000 characters')
        .optional(),
});


const updateReviewSchema = z.object({
    rating: z
        .coerce
        .number()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5')
        .optional(),

    review: z
        .string()
        .trim()
        .max(1000, 'Review cannot exceed 1000 characters')
        .optional(),
});


const courseReviewsParamsSchema = z.object({
    courseId: objectIdSchema,
});


const reviewIdParamsSchema = z.object({
    reviewId: objectIdSchema,
});


module.exports = {
    createReviewSchema,
    updateReviewSchema,
    courseReviewsParamsSchema,
    reviewIdParamsSchema,
};