const asyncHandler = require('../../utils/asyncHandler');
const dashboardService = require('./dashboard.service');

const getStats = asyncHandler(async (req,res)=>{

    const result = await dashboardService.getStats();

    return res.status(200).json({
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: result,
    });

});

const getPopularCourses = asyncHandler(async(req,res)=>{

    const result = await dashboardService.getPopularCourses();

    return res.status(200).json({
        success: true,
        message: 'Popular courses retrieved successfully',
        data: result,
    });

});

const getRevenueAnalytics = asyncHandler(async(req,res)=>{

    const result = await dashboardService.getRevenueAnalytics();

    return res.status(200).json({
        success: true,
        message: 'Revenue analytics retrieved successfully',
        data: result,
    });

});

const getRecentActivity = asyncHandler (async (req, res)=>{
    const result = await dashboardService.getRecentActivity();

    return res.status(200).json({
        success: true,
        message: 'Recent activity retrieved successfully',
        data: result,
    });
});

module.exports = {
    getStats,
    getPopularCourses,
    getRevenueAnalytics,
    getRecentActivity,
};