const logger = require('../config/logger');

const requestLogger = (req, res, next) => {

    const startTime = Date.now();

    res.on('finish', () => {

        const duration = Date.now() - startTime;

        logger.info({
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            responseTime: `${duration}ms`,
            userId: req.user ? req.user._id : null,
            ip: req.ip,
        });

    });

    next();
};

module.exports = requestLogger;