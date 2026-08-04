const { z } = require('zod');

const { userRoles } = require('../../constants/user.constants');


const registerSchema = z.object({

    name: z
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters'),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Invalid email address'),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(72, 'Password cannot exceed 72 characters'),

    role: z
        .enum(['student', 'instructor'], {
            message: 'Role must be either student or instructor',
        })
        .default('student'),

});


const loginSchema = z.object({

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Invalid email address'),

    password: z
        .string()
        .min(1, 'Password is required'),

});


module.exports = {
    registerSchema,
    loginSchema,
    userRoles,
};
