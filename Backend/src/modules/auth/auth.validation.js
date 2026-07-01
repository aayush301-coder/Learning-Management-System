const { z } = require("zod");

const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });
    }
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

module.exports = {
    registerSchema,
    loginSchema,
};