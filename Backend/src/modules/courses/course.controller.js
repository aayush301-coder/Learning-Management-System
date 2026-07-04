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

module.exports = {
    createCourse,
    getAllCourses,
}
