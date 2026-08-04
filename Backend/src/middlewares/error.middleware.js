const logger = require('../utils/logger');


const errorMiddleware = (error, req, res, next) => {

    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal server error';

    // Mongoose bad ObjectId
    if (error.name === 'CastError') {

        statusCode = 400;
        message = `Invalid ${error.path}`;

    }

    // Mongoose duplicate key
    if (error.code === 11000) {

        statusCode = 409;

        const field = Object.keys(error.keyValue || {})[0];

        message = field
            ? `${field} already exists`
            : 'Duplicate value';

    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {

        statusCode = 400;
        message = Object.values(error.errors)
            .map((err) => err.message)
            .join(', ');

    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {

        statusCode = 401;
        message = 'Invalid token';

    }

    if (error.name === 'TokenExpiredError') {

        statusCode = 401;
        message = 'Token expired';

    }

    if (statusCode >= 500) {

        logger.error(`${req.method} ${req.originalUrl} - ${error.stack || error.message}`);

    }

    res.status(statusCode).json({

        success: false,
        message,
        ...(error.errors ? { errors: error.errors } : {}),

    });

};


module.exports = errorMiddleware;
