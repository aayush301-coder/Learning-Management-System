const Enrollment = require('./enrollment.model');
const Course = require('../courses/course.model');
const Progress = require('../progress/progress.model');
const notificationService = require('../notifications/notification.service');


const enrollInCourse = async (validatedParams, authenticatedUser) => {

    const course = await Course.findById(validatedParams.courseId);

    if (!course) {

        const error = new Error('Course not found');

        error.statusCode = 404;

        throw error;

    }

    if (course.status !== 'published') {

        const error = new Error('This course is not currently available for enrollment');

        error.statusCode = 400;

        throw error;

    }

    const existingEnrollment = await Enrollment.findOne({
        student: authenticatedUser._id,
        course: course._id,
    });

    if (existingEnrollment) {

        const error = new Error('You are already enrolled in this course');

        error.statusCode = 409;

        throw error;

    }

    const enrollment = await Enrollment.create({

        student: authenticatedUser._id,
        course: course._id,

    });

    await Progress.create({

        student: authenticatedUser._id,
        course: course._id,

    });

    await notificationService.createNotification({

        userId: authenticatedUser._id,
        title: 'Enrollment confirmed',
        message: `You are now enrolled in "${course.title}". Happy learning!`,
        type: 'enrollment',

    });

    return enrollment;

};


const getMyEnrollments = async (authenticatedUser) => {

    const enrollments = await Enrollment.find({
        student: authenticatedUser._id,
        status: 'active',
    })
        .populate({
            path: 'course',
            populate: { path: 'instructor', select: 'name email avatar' },
        })
        .sort({ createdAt: -1 });

    return enrollments;

};


const cancelEnrollment = async (validatedParams, authenticatedUser) => {

    const enrollment = await Enrollment.findOne({
        student: authenticatedUser._id,
        course: validatedParams.courseId,
    });

    if (!enrollment) {

        const error = new Error('Enrollment not found');

        error.statusCode = 404;

        throw error;

    }

    await enrollment.deleteOne();

    await Progress.deleteOne({
        student: authenticatedUser._id,
        course: validatedParams.courseId,
    });

    return { courseId: validatedParams.courseId };

};


module.exports = {
    enrollInCourse,
    getMyEnrollments,
    cancelEnrollment,
};
