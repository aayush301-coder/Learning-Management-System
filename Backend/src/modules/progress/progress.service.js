const Progress = require('./progress.model');
const Section = require('../sections/section.model');
const Lesson = require('../lessons/lesson.model');


const countLessonsInCourse = async (courseId) => {

    const sections = await Section.find({ course: courseId }).select('_id');

    const sectionIds = sections.map((section) => section._id);

    return Lesson.countDocuments({ section: { $in: sectionIds } });

};


const findProgressOrThrow = async (studentId, courseId) => {

    const progress = await Progress.findOne({
        student: studentId,
        course: courseId,
    });

    if (!progress) {

        const error = new Error('You are not enrolled in this course');

        error.statusCode = 404;

        throw error;

    }

    return progress;

};


const completeLesson = async (validatedParams, authenticatedUser) => {

    const { courseId, lessonId } = validatedParams;

    const progress = await findProgressOrThrow(authenticatedUser._id, courseId);

    const alreadyCompleted = progress.completedLessons.some(
        (id) => id.toString() === lessonId
    );

    if (!alreadyCompleted) {

        progress.completedLessons.push(lessonId);

    }

    progress.lastAccessedLesson = lessonId;

    const totalLessons = await countLessonsInCourse(courseId);

    progress.completionPercentage = totalLessons > 0
        ? Math.round((progress.completedLessons.length / totalLessons) * 100)
        : 0;

    if (progress.completionPercentage >= 100) {

        progress.completionStatus = 'completed';

    }
    else if (progress.completionPercentage > 0) {

        progress.completionStatus = 'in_progress';

    }
    else {

        progress.completionStatus = 'not_started';

    }

    await progress.save();

    return progress;

};


const updateLastAccessedLesson = async (validatedParams, validatedBody, authenticatedUser) => {

    const progress = await findProgressOrThrow(authenticatedUser._id, validatedParams.courseId);

    progress.lastAccessedLesson = validatedBody.lessonId;

    await progress.save();

    return progress;

};


const getCourseProgress = async (validatedParams, authenticatedUser) => {

    const progress = await Progress.findOne({
        student: authenticatedUser._id,
        course: validatedParams.courseId,
    })
        .populate('course')
        .populate('completedLessons')
        .populate('lastAccessedLesson');

    if (!progress) {

        const error = new Error('Progress not found');

        error.statusCode = 404;

        throw error;

    }

    return progress;

};


const getStudentProgress = async (authenticatedUser) => {

    const progress = await Progress.find({
        student: authenticatedUser._id,
    })
        .populate('course')
        .populate('lastAccessedLesson');

    return progress;

};


module.exports = {
    completeLesson,
    updateLastAccessedLesson,
    getCourseProgress,
    getStudentProgress,
};
