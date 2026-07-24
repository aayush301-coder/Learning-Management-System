const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const paymentController = require('./payment.controller');
const { createPaymentParamsSchema, verifyPaymentParamsSchema } = require('./payment.validation');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');

// Create Payment Order
router.post('/create/:courseId', authMiddleware, authorizeMiddleware('student'), validateMiddleware(createPaymentParamsSchema, 'params'), paymentController.createPaymentOrder);

//Verify Payment
router.post('/verify/:paymentId', authMiddleware, authorizeMiddleware('student'), validateMiddleware(verifyPaymentParamsSchema, 'params'), paymentController.verifyPayment);

//Get My Payments
router.get('/me', authMiddleware, authorizeMiddleware('student'), paymentController.getMyPayments);

module.exports = router;