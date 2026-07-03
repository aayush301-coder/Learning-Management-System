const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Internal Server Error';
    if (process.env.NODE_ENV !== 'production') {
        console.error(error);
    }
    return res.status(statusCode).json({
        success: false,
        message,
        errors: error.errors || [],
    });
};

module.exports = errorHandler;