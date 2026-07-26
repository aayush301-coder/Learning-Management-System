const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const paymentController = require('./payment.controller');
const { createPaymentParamsSchema, verifyPaymentParamsSchema, verifyPaymentBodySchema } = require('./payment.validation');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const { paymentLimiter } = require('../../middlewares/rateLimiter.middleware');

/**
 * @swagger
 * /payments/create/:courseId:
 *   post:
 *     summary: Create payment order for a course
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/create/:courseId', authMiddleware, authorizeMiddleware('student'), paymentLimiter, validateMiddleware(createPaymentParamsSchema, 'params'), paymentController.createPaymentOrder);

/**
 * @swagger
 * /payments/verify/:paymentId:
 *   post:
 *     summary: Verify Payment order for a course
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/verify/:paymentId', authMiddleware, authorizeMiddleware('student'), paymentLimiter, validateMiddleware(verifyPaymentParamsSchema, 'params'), validateMiddleware(verifyPaymentBodySchema, 'body'), paymentController.verifyPayment);

/**
 * @swagger
 * /payments/me:
 *   get:
 *     summary: Get My Payments for a student
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authMiddleware, authorizeMiddleware('student'), paymentController.getMyPayments);

module.exports = router;