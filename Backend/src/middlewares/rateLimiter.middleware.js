const rateLimit = require('express-rate-limit');



const createLimiter = (options) => {

    if (process.env.NODE_ENV === 'test') {

        return (req, res, next) => {
            next();
        };

    }


    return rateLimit(options);

};




// General API limiter
const apiLimiter = createLimiter({

    windowMs: 15 * 60 * 1000,

    max: 200,

    message: {
        success: false,
        message: 'Too many requests. Please try again later.',
    },

    standardHeaders: true,

    legacyHeaders: false,

});




// Authentication limiter
const authLimiter = createLimiter({

    windowMs: 15 * 60 * 1000,

    max: 10,

    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again later.',
    },

    standardHeaders: true,

    legacyHeaders: false,

});




// Payment limiter
const paymentLimiter = createLimiter({

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