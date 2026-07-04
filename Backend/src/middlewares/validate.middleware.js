const validateMiddleware = (schema, validationSource = 'body') => {
    return (req, res, next) => {
        const result = schema.safeParse(req[validationSource]);

        if (!result.success) {
            result.error.statusCode = 400;
            result.error.message = 'Validation failed';
            result.error.errors = result.error.issues;

            return next(result.error);
        }

        req.validated = req.validated || {};
        req.validated[validationSource] = result.data;

        return next();
    };
};

module.exports = validateMiddleware;