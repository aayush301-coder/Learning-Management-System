const asyncHandler = require('../../utils/asyncHandler');
const enrollmentService = require('./enrollment.service');

const enrollInCourse = asyncHandler(async (req, res) => {
    const result = await enrollmentService.enrollInCourse(req.validated.params, req.user);
    return res.status(201).json({
        success: true,
        message: 'Enrollment Created Successfully',
        data: result
    });
});

const getMyEnrollments = asyncHandler(async (req, res) => {
    const result = await enrollmentService.getMyEnrollments(req.user);
    return res.status(200).json({
        success: true,
        message: 'My Enrollments Retrieved Successfully',
        data: result,
    });
});

const cancelEnrollment = asyncHandler(async (req, res) => {
    const result = await enrollmentService.cancelEnrollment(req.validated.params, req.user);
    return res.status(200).json({
        success: true,
        message: 'Enrollment cancelled successfully.',
    });
});

module.exports = {
    enrollInCourse,
    getMyEnrollments,
    cancelEnrollment,
}