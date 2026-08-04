const { z } = require('zod');


const getNotificationsSchema = z.object({

    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(20),

    isRead: z.preprocess(
        (value) => value === '' ? undefined : value,
        z.enum(['true', 'false']).optional()
    ),

});


const notificationIdParamsSchema = z.object({

    notificationId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid notification id'),

});


module.exports = {
    getNotificationsSchema,
    notificationIdParamsSchema,
};
