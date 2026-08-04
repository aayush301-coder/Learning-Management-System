// Lightweight in-memory rate limiter (no external store needed for
// a single-instance deployment). Keyed by IP + route path.
const requestLog = new Map();

const rateLimiterMiddleware = (options = {}) => {

    const windowMs = options.windowMs || 15 * 60 * 1000;
    const max = options.max || 100;

    return (req, res, next) => {

        const key = `${req.ip}:${req.baseUrl}`;

        const now = Date.now();

        const entry = requestLog.get(key) || { count: 0, resetAt: now + windowMs };

        if (now > entry.resetAt) {

            entry.count = 0;
            entry.resetAt = now + windowMs;

        }

        entry.count += 1;

        requestLog.set(key, entry);

        if (entry.count > max) {

            const error = new Error('Too many requests, please try again later');

            error.statusCode = 429;

            return next(error);

        }

        next();

    };

};


module.exports = rateLimiterMiddleware;
