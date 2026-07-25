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

const verifyPaymentBodySchema = z.object({
    razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required'),
    razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
    razorpay_signature: z.string().min(1, 'Razorpay signature is required'),
});

module.exports = {
    createPaymentParamsSchema,
    verifyPaymentParamsSchema,
    verifyPaymentBodySchema,
};