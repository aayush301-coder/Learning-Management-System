const jwt = require('jsonwebtoken');

const User = require('../modules/users/user.model');


const authMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {

            const error = new Error('Not authenticated');

            error.statusCode = 401;

            throw error;

        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {

            const error = new Error('User no longer exists');

            error.statusCode = 401;

            throw error;

        }

        req.user = user;

        next();

    }
    catch (error) {

        error.statusCode = error.statusCode || 401;

        error.message = error.message || 'Not authenticated';

        next(error);

    }

};


module.exports = authMiddleware;
