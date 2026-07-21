const Enrollment = require('./enrollment.model');
const Course = require('../courses/course.model');
const Progress = require('../progress/progress.model');

const enrollInCourse = async (validatedParams, authenticatedUser) => {
    const { courseId } = validatedParams;
    const course = await Course.findById(courseId);

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if (authenticatedUser.role !== 'student') {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }
    if (course.status !== 'published') {
        const error = new Error('Only published courses can be enrolled in.');
        error.statusCode = 409;
        throw error;
    }

    const enrolled = await Enrollment.findOne({ student: authenticatedUser._id, course: courseId });

    if (enrolled) {
        const error = new Error('You are already enrolled in this course.');
        error.statusCode = 409;
        throw error;
    }

    const enrollment = await Enrollment.create({
        student: authenticatedUser._id,
        course: courseId,
    });

    await Progress.create({
        student: authenticatedUser._id,
        course: courseId,
    });

    return enrollment;
};

const getMyEnrollments = async (authenticatedUser) => {
    if (authenticatedUser.role !== 'student') {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    const enrollments = await Enrollment.find({student: authenticatedUser._id}).populate('course', 'title thumbnail category level instructor');
    return enrollments;
};

const cancelEnrollment = async (validatedParams, authenticatedUser) => {
    const { courseId } = validatedParams;

    if (authenticatedUser.role !== 'student') {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }
    const enrolled = await Enrollment.findOne({ student: authenticatedUser._id, course: courseId });
    if (!enrolled) {
        const error = new Error('You are not enrolled in this course.');
        error.statusCode = 404;
        throw error;
    }
    await enrolled.deleteOne();
    return {
        message: 'Enrollment cancelled successfully.',
    }
};

module.exports = {
    enrollInCourse,
    getMyEnrollments,
    cancelEnrollment,
};