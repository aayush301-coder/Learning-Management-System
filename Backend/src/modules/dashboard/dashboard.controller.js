const asyncHandler = require('../../utils/asyncHandler');

const dashboardService = require('./dashboard.service');


const getDashboardStats = asyncHandler(async (req, res) => {

    const stats = await dashboardService.getDashboardStats();

    res.status(200).json({

        success: true,
        message: 'Dashboard stats retrieved successfully',
        data: stats,

    });

});


const getPopularCourses = asyncHandler(async (req, res) => {

    const popularCourses = await dashboardService.getPopularCourses();

    res.status(200).json({

        success: true,
        message: 'Popular courses retrieved successfully',
        data: popularCourses,

    });

});


const getRecentActivity = asyncHandler(async (req, res) => {

    const activity = await dashboardService.getRecentActivity();

    res.status(200).json({

        success: true,
        message: 'Recent activity retrieved successfully',
        data: activity,

    });

});


module.exports = {
    getDashboardStats,
    getPopularCourses,
    getRecentActivity,
};
