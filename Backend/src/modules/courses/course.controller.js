const asyncHandler = require('../../utils/asyncHandler');

const courseService = require('./course.service');


const getAllCourses = asyncHandler(async (req, res) => {

    const result = await courseService.getAllCourses(req.validated.query, req.user);

    res.status(200).json({

        success: true,
        message: 'Courses retrieved successfully',
        data: result,

    });

});


const getMyCourses = asyncHandler(async (req, res) => {

    const result = await courseService.getMyCourses(req.validated.query, req.user);

    res.status(200).json({

        success: true,
        message: 'Your courses retrieved successfully',
        data: result,

    });

});


const getCourseById = asyncHandler(async (req, res) => {

    const course = await courseService.getCourseById(req.validated.params, req.user);

    res.status(200).json({

        success: true,
        message: 'Course retrieved successfully',
        data: course,

    });

});


const createCourse = asyncHandler(async (req, res) => {

    const course = await courseService.createCourse(req.validated.body, req.user);

    res.status(201).json({

        success: true,
        message: 'Course created successfully',
        data: course,

    });

});


const updateCourse = asyncHandler(async (req, res) => {

    const course = await courseService.updateCourse(req.validated.params, req.validated.body, req.user);

    res.status(200).json({

        success: true,
        message: 'Course updated successfully',
        data: course,

    });

});


const deleteCourse = asyncHandler(async (req, res) => {

    const result = await courseService.deleteCourse(req.validated.params, req.user);

    res.status(200).json({

        success: true,
        message: 'Course deleted successfully',
        data: result,

    });

});


const submitForReview = asyncHandler(async (req, res) => {

    const course = await courseService.submitForReview(req.validated.params, req.user);

    res.status(200).json({

        success: true,
        message: 'Course submitted for review',
        data: course,

    });

});


const publishCourse = asyncHandler(async (req, res) => {

    const course = await courseService.publishCourse(req.validated.params);

    res.status(200).json({

        success: true,
        message: 'Course published successfully',
        data: course,

    });

});


const unpublishCourse = asyncHandler(async (req, res) => {

    const course = await courseService.unpublishCourse(req.validated.params, req.user);

    res.status(200).json({

        success: true,
        message: 'Course unpublished successfully',
        data: course,

    });

});


const archiveCourse = asyncHandler(async (req, res) => {

    const course = await courseService.archiveCourse(req.validated.params);

    res.status(200).json({

        success: true,
        message: 'Course archived successfully',
        data: course,

    });

});


const restoreArchivedCourse = asyncHandler(async (req, res) => {

    const course = await courseService.restoreArchivedCourse(req.validated.params);

    res.status(200).json({

        success: true,
        message: 'Course restored successfully',
        data: course,

    });

});


module.exports = {
    getAllCourses,
    getMyCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    submitForReview,
    publishCourse,
    unpublishCourse,
    archiveCourse,
    restoreArchivedCourse,
};
