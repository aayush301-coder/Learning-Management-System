const asyncHandler = require('../../utils/asyncHandler');
const paymentService = require('./payment.service');

const createPaymentOrder = asyncHandler(async (req, res) => {
    const { courseId } = req.validated.params;

    const result = await paymentService.createPaymentOrder(
        { courseId },
        req.user
    );

    return res.status(201).json({
        success: true,
        message: 'Payment order created successfully',
        data: result,
    });
});

const verifyPayment = asyncHandler(async (req, res) => {
    const { paymentId } = req.validated.params;

    const result = await paymentService.verifyPayment(
        { paymentId },
        req.user
    );

    return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: result,
    });
});

const getMyPayments = asyncHandler(async (req, res) => {
    const result = await paymentService.getMyPayments(req.user);

    return res.status(200).json({
        success: true,
        message: 'Payments retrieved successfully',
        data: result,
    });
});

module.exports = {
    createPaymentOrder,
    verifyPayment,
    getMyPayments,
};