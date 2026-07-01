const authService = require('./auth.service');

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'User Registered Successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json({
            success: true,
            message: 'Login Successful',
            data: result,
        })
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
};