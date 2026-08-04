const asyncHandler = require('../../utils/asyncHandler');

const userService = require('./user.service');


const getAllUsers = asyncHandler(async (req, res) => {

    const result = await userService.getAllUsers(req.validated.query);

    res.status(200).json({

        success: true,
        message: 'Users retrieved successfully',
        data: result,

    });

});


const updateOwnProfile = asyncHandler(async (req, res) => {

    const user = await userService.updateOwnProfile(
        req.validated.body,
        req.user
    );

    res.status(200).json({

        success: true,
        message: 'Profile updated successfully',
        data: user,

    });

});


module.exports = {
    getAllUsers,
    updateOwnProfile,
};
