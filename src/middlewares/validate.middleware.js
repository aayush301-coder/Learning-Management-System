const validateMiddleware = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if(!result.success) {
            result.error.status = 400;
            return next(result.error);
        }
        req.body = result.data;
        next();
    };
};

module.exports = validateMiddleware;
