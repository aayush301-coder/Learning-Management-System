const asyncHandler = require('../../utils/asyncHandler');

const enrollmentService = require('./enrollment.service');


const enrollInCourse = asyncHandler(async (req, res) => {

    const enrollment = await enrollmentService.enrollInCourse(req.validated.params, req.user);

    res.status(201).json({

        success: true,
        message: 'Enrolled successfully',
        data: enrollment,

    });

});


const getMyEnrollments = asyncHandler(async (req, res) => {

    const enrollments = await enrollmentService.getMyEnrollments(req.user);

    res.status(200).json({

        success: true,
        message: 'Enrollments retrieved successfully',
        data: enrollments,

    });

});


const cancelEnrollment = asyncHandler(async (req, res) => {

    const result = await enrollmentService.cancelEnrollment(req.validated.params, req.user);

    res.status(200).json({

        success: true,
        message: 'Enrollment cancelled successfully',
        data: result,

    });

});


module.exports = {
    enrollInCourse,
    getMyEnrollments,
    cancelEnrollment,
};
