const validateMiddleware = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            result.error.statusCode = 400;
            result.error.message = 'Validation failed';
            result.error.errors = result.error.issues;

            return next(result.error);
        }

        req.body = result.data;

        return next();
    };
};

module.exports = validateMiddleware;