const validateMiddleware = (schema, validationSource = 'body') => {
    const allowedSources = ['body', 'params', 'query'];

    if (!allowedSources.includes(validationSource)) {
        throw new Error(
            `Invalid validation source "${validationSource}". Allowed sources are: ${allowedSources.join(', ')}`
        );
    }

    return (req, res, next) => {
        const result = schema.safeParse(req[validationSource]);

        if (!result.success) {
            const error = new Error('Validation failed');

            error.statusCode = 400;
            error.errors = result.error.issues;

            return next(error);
        }

        req[validationSource] = result.data;
        req.validated = req.validated || {};
        req.validated[validationSource] = result.data;

        next();
    };
};

module.exports = validateMiddleware;