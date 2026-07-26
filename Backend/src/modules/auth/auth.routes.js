const router = require('express').Router();
const { registerSchema, loginSchema } = require('./auth.validation');
const validateMiddleware = require('../../middlewares/validate.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const { register, login, getCurrentUser } = require('./auth.controller');
const { authLimiter } = require('../../middlewares/rateLimiter.middleware');


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management APIs
 */


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aayush
 *
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: password123
 *
 *               confirmPassword:
 *                 type: string
 *                 example: password123
 *
 *               role:
 *                 type: string
 *                 example: student
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 *       400:
 *         description: Validation error or email already exists
 */
router.post('/register', authLimiter, validateMiddleware(registerSchema), register);


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - email
 *               - password
 *
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: password123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authLimiter, validateMiddleware(loginSchema), login);


/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *
 *       401:
 *         description: Unauthorized user
 *
 *       403:
 *         description: Forbidden access
 */
router.get('/me', authMiddleware, authorizeMiddleware('student','admin'), getCurrentUser);


module.exports = router;