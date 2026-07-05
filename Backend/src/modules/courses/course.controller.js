const asyncHandler = require('../../utils/asyncHandler');
const courseService = require('./course.service');

const createCourse = asyncHandler(async (req, res) => {
    const result = await courseService.createCourse(req.validated.body, req.user.id);
    return res.status(201).json({
        success: true,
        message: 'Course Created Successfully',
        data: result
    });
});

const getAllCourses = asyncHandler(async (req, res) => {
    const result = await courseService.getAllCourses(req.validated.query, req.user);
    return res.status(200).json({
        success: true,
        message: 'Courses Retrieved Successfully',
        data: result
    });
});

const getCourseById = asyncHandler(async (req, res) => {
    const result = await courseService.getCourseById(req.validated.params, req.user);
    return res.status(200).json({
        success: true,
        message: 'Course Retrieved Successfully',
        data: result
    });
});

const updateCourse = asyncHandler(async (req, res) => {
    const result = await courseService.updateCourse(req.validated.params, req.validated.body, req.user);
    return res.status(200).json({
        success: true,
        message: 'Course Updated Successfully',
        data: result
    });
});

const deleteCourse = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Course Deleted Successfully',
    });
});

const submitCourseForReview = asyncHandler(async (req, res) => {
    const result = await courseService.submitCourseForReview(req.validated.params, req.user);
    return res.status(200).json({
        success: true,
        message: 'Course submitted for review successfully',
        data: result,
    });
});

const publishCourse = asyncHandler(async (req, res) => {
    const result = await courseService.publishCourse(req.validated.params, req.user);
    return res.status(200).json({
        sucess:true,
        message:'Course Published Successfully',
        data:result,
    });
});

const unpublishCourse = asyncHandler(async (req, res) => {
    const result = await courseService.unpublishCourse(req.validated.params, req.user);
    return res.status(200).json({
        success:true,
        message: 'Course Unpublished Successfully',
        data: result,
    });
});

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    submitCourseForReview,
    publishCourse,
    unpublishCourse,
};
