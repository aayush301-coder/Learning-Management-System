const asyncHandler = require('../../utils/asyncHandler');

const progressService = require('./progress.service');


const completeLesson = asyncHandler(async (req, res) => {

    const progress = await progressService.completeLesson(req.validated.params, req.user);

    res.status(200).json({

        success: true,
        message: 'Lesson marked as complete',
        data: progress,

    });

});


const updateLastAccessedLesson = asyncHandler(async (req, res) => {

    const progress = await progressService.updateLastAccessedLesson(req.validated.params, req.validated.body, req.user);

    res.status(200).json({

        success: true,
        message: 'Last accessed lesson updated',
        data: progress,

    });

});


const getCourseProgress = asyncHandler(async (req, res) => {

    const progress = await progressService.getCourseProgress(req.validated.params, req.user);

    res.status(200).json({

        success: true,
        message: 'Progress retrieved successfully',
        data: progress,

    });

});


const getStudentProgress = asyncHandler(async (req, res) => {

    const progress = await progressService.getStudentProgress(req.user);

    res.status(200).json({

        success: true,
        message: 'Progress retrieved successfully',
        data: progress,

    });

});


module.exports = {
    completeLesson,
    updateLastAccessedLesson,
    getCourseProgress,
    getStudentProgress,
};
