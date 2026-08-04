const asyncHandler = require('../../utils/asyncHandler');

const authService = require('./auth.service');


const register = asyncHandler(async (req, res) => {

    const user = await authService.register(req.validated.body);

    res.status(201).json({

        success: true,
        message: 'Registered successfully. You can now log in.',
        data: user,

    });

});


const login = asyncHandler(async (req, res) => {

    const { accessToken, user } = await authService.login(req.validated.body);

    res.status(200).json({

        success: true,
        message: 'Logged in successfully',
        data: { accessToken, user },

    });

});


const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await authService.getCurrentUser(req.user);

    res.status(200).json({

        success: true,
        message: 'Current user retrieved successfully',
        data: user,

    });

});


module.exports = {
    register,
    login,
    getCurrentUser,
};
