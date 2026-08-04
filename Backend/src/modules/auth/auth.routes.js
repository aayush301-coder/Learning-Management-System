const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const rateLimiterMiddleware = require('../../middlewares/rateLimiter.middleware');

const {
    register,
    login,
    getCurrentUser,
} = require('./auth.controller');

const {
    registerSchema,
    loginSchema,
} = require('./auth.validation');


const authRateLimiter = rateLimiterMiddleware({ windowMs: 15 * 60 * 1000, max: 20 });


router.post(
    '/register',
    authRateLimiter,
    validateMiddleware(registerSchema, 'body'),
    register
);


router.post(
    '/login',
    authRateLimiter,
    validateMiddleware(loginSchema, 'body'),
    login
);


router.get(
    '/me',
    authMiddleware,
    getCurrentUser
);


module.exports = router;
