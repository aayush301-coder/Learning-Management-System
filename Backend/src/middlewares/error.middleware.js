const logger = require('../config/logger');

const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Internal Server Error';

    logger.error({
        message,
        statusCode,
        stack: error.stack,
        method: req.method,
        url: req.originalUrl,
        userId: req.user ? req.user._id : null,
    });

    return res.status(statusCode).json({
        success: false,
        message,
        errors: error.errors || [],
    });
};

module.exports = errorHandler;