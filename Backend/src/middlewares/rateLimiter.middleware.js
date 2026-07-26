const rateLimit = require('express-rate-limit');


// General API limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // max requests per IP
    message: {
        success: false,
        message: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});


// Strict limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});


// Strict limiter for payment operations
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success:false,
        message:'Too many payment requests. Please try again later.',
    },
    standardHeaders:true,
    legacyHeaders:false,
});


module.exports = {
    apiLimiter,
    authLimiter,
    paymentLimiter,
};