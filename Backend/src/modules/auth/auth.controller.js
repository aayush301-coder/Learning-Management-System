const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    return res.status(201).json({
        success: true,
        message: 'User Registered Successfully',
        data: result,
    });
});

const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    return res.status(200).json({
        success: true,
        message: 'Login Successful',
        data: result
    });
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'User Fetched Successfully',
        data: req.user,
    });
});

module.exports = {
    register,
    login,
    getCurrentUser,
};