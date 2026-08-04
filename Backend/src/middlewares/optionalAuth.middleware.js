const jwt = require('jsonwebtoken');

const User = require('../modules/users/user.model');


// Attaches req.user if a valid token is present, but never blocks
// the request when it's missing or invalid — for routes that are
// public but behave differently for a logged-in user (e.g. course
// browsing shows drafts to their own instructor).
const optionalAuthMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {

            return next();

        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        if (user) {

            req.user = user;

        }

        next();

    }
    catch (error) {

        // Invalid/expired token on an optional route — proceed as a guest.
        next();

    }

};


module.exports = optionalAuthMiddleware;
