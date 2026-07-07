const asyncHandler = require('../../utils/asyncHandler');
const lessonService = require('./lesson.service');

const createLesson = asyncHandler(async (req, res) => {
    const result = await lessonService.createLesson(req.validated.params, req.validated.body, req.user);
    return res.status(201).json({
        success: true,
        message: 'Lesson Created Successfully',
        data: result
    });
});

const getLessonsBySection = asyncHandler(async (req, res) => {
    const result = await lessonService.getLessonsBySection(req.validated.params, req.user);
    return res.status(200).json({
        success: true,
        message: 'Lessons Fetched Successfully',
        data: result
    });
});

const getLessonById = asyncHandler(async (req, res) => {
    const result = await lessonService.getLessonById(req.validated.params, req.user);
    return res.status(200).json({
        success: true,
        message: 'Lesson Fetched Successfully',
        data: result
    });
});

const updateLesson = asyncHandler(async (req, res) => {
    const result = await lessonService.updateLesson(req.validated.params, req.validated.body, req.user);
    return res.status(200).json({
        success: true,
        message: 'Lesson Updated Successfully',
        data: result
    });
});

const deleteLesson = asyncHandler(async (req, res) => {
    const result = await lessonService.deleteLesson(req.validated.params, req.user);
    return res.status(200).json({
        success: true,
        message: result.message
    });
});

module.exports = {
    createLesson,
    getLessonsBySection,
    getLessonById,
    updateLesson,
    deleteLesson,
}