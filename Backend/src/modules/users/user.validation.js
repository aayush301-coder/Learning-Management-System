const { z } = require('zod');

const { userRoles } = require('../../constants/user.constants');


const getAllUsersSchema = z.object({

    page: z.coerce
        .number()
        .min(1, 'Page number must be positive')
        .default(1),

    limit: z.coerce
        .number()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
        .default(20),

    search: z.preprocess(
        (value) => value === '' ? undefined : value,
        z.string()
            .trim()
            .max(100, 'Search query cannot exceed 100 characters')
            .optional()
    ),

    role: z.preprocess(
        (value) => value === '' ? undefined : value,
        z.enum(userRoles, { message: 'Role is not valid' }).optional()
    ),

});


const updateOwnProfileSchema = z.object({

    name: z
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),

    avatar: z
        .string()
        .trim()
        .url('Invalid avatar URL')
        .optional(),

}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
});


module.exports = {
    getAllUsersSchema,
    updateOwnProfileSchema,
};
