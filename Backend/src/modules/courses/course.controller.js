const asyncHandler = require('../../utils/asyncHandler');
const courseService = require('./course.service');

const createCourse = asyncHandler(async (req, res) => {
    const result = await courseService.createCourse(req.body, req.user.id);
    return res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: result
    });
});

module.exports = {
    createCourse,
}
