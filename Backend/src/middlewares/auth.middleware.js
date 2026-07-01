const jwt = require('jsonwebtoken');
const userModel = require('../modules/users/user.model');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No Token Provided',
        })
    }
    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({
            success: false,
            message: 'No Token Provided',
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication',
            })
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid authentication',
        })
    }
}

module.exports = authMiddleware;