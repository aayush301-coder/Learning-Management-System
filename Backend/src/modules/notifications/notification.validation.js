const { z } = require('zod');


const objectIdSchema = z
    .string()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        'Invalid MongoDB ObjectId'
    );


const createNotificationSchema = z.object({
    recipient: objectIdSchema,

    title: z
        .string()
        .trim()
        .min(3)
        .max(150),

    message: z
        .string()
        .trim()
        .min(5)
        .max(500),

    type: z.enum([
        'enrollment',
        'payment',
        'course',
        'certificate',
        'review',
        'system',
    ]),

    referenceId: objectIdSchema.optional(),
});


const notificationIdSchema = z.object({
    notificationId: objectIdSchema,
});


module.exports = {
    createNotificationSchema,
    notificationIdSchema,
};