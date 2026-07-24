const z = require('zod');

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

const createPaymentParamsSchema = z.object({
    courseId: objectIdSchema,
});

const verifyPaymentParamsSchema = z.object({
    paymentId: objectIdSchema,
});

module.exports = {
    createPaymentParamsSchema,
    verifyPaymentParamsSchema,
};