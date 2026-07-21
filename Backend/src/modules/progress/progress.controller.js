const asyncHandler = require('../../utils/asyncHandler');
const progressService = require('./progress.service');

const completeLesson = asyncHandler(async (req, res) => {
    const { courseId, lessonId } = req.validated.params;

    const progress = await progressService.completeLesson(
        { courseId, lessonId },
        req.user
    );

    res.status(200).json({
        success: true,
        message: 'Lesson completed successfully',
        data: progress,
    });
});

const updateLastAccessedLesson = asyncHandler(async (req, res) => {
    const { courseId } = req.validated.params;
    const { lessonId } = req.validated.body;

    const progress = await progressService.updateLastAccessedLesson(
        { courseId, lessonId },
        req.user
    );

    res.status(200).json({
        success: true,
        message: 'Last accessed lesson updated successfully',
        data: progress,
    });
});

const getCourseProgress = asyncHandler(async (req, res) => {
    const { courseId } = req.validated.params;

    const progress = await progressService.getCourseProgress(
        { courseId },
        req.user
    );

    res.status(200).json({
        success: true,
        message: 'Course progress retrieved successfully',
        data: progress,
    });
});

const getStudentProgress = asyncHandler(async (req, res) => {
    const progress = await progressService.getStudentProgress(
        req.user
    );

    res.status(200).json({
        success: true,
        message: 'Student progress retrieved successfully',
        data: progress,
    });
});

module.exports = {
    completeLesson,
    updateLastAccessedLesson,
    getCourseProgress,
    getStudentProgress,
};