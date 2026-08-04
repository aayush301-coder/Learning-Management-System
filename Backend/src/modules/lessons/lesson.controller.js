const asyncHandler = require('../../utils/asyncHandler');

const lessonService = require('./lesson.service');


const getLessonsBySection = asyncHandler(async (req, res) => {

    const lessons = await lessonService.getLessonsBySection(req.validated.params);

    res.status(200).json({

        success: true,
        message: 'Lessons retrieved successfully',
        data: lessons,

    });

});


const createLesson = asyncHandler(async (req, res) => {

    const lesson = await lessonService.createLesson(req.validated.params, req.validated.body, req.user);

    res.status(201).json({

        success: true,
        message: 'Lesson created successfully',
        data: lesson,

    });

});


const updateLesson = asyncHandler(async (req, res) => {

    const lesson = await lessonService.updateLesson(req.validated.params, req.validated.body, req.user);

    res.status(200).json({

        success: true,
        message: 'Lesson updated successfully',
        data: lesson,

    });

});


const deleteLesson = asyncHandler(async (req, res) => {

    const result = await lessonService.deleteLesson(req.validated.params, req.user);

    res.status(200).json({

        success: true,
        message: 'Lesson deleted successfully',
        data: result,

    });

});


module.exports = {
    getLessonsBySection,
    createLesson,
    updateLesson,
    deleteLesson,
};
