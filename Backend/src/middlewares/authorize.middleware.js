const authorizeMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if(!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to access this resource',
            });
        }
        next();
    };
};

module.exports = authorizeMiddleware;