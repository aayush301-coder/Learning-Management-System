const Progress = require('./progress.model');
const Enrollment = require('../enrollments/enrollment.model');
const Lesson = require('../lessons/lesson.model');
const Section = require('../sections/section.model');

const getTotalLessons = async (courseId) => {
    const sections = await Section.find({course: courseId,}).select('_id');
    const sectionIds = sections.map((section) => section._id);
    const totalLessons = await Lesson.countDocuments({
        section: {
            $in: sectionIds,
        },
    });

    return totalLessons;
};

const completeLesson = async (validatedParams, authenticatedUser) => {
    const { courseId, lessonId } = validatedParams;
    const studentId = authenticatedUser._id;
    const enrolled = await Enrollment.findOne({
        student: studentId,
        course: courseId,
    });

    if (!enrolled) {
        const error = new Error('Student is not enrolled in the course');
        error.statusCode = 403;
        throw error;
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
        const error = new Error('Lesson not found');
        error.statusCode = 404;
        throw error;
    }

    const section = await Section.findById(lesson.section);

    if (!section) {
        const error = new Error('Section not found');
        error.statusCode = 404;
        throw error;
    }

    if (section.course.toString() !== courseId) {
        const error = new Error('Lesson does not belong to this course');
        error.statusCode = 400;
        throw error;
    }

    const progress = await Progress.findOne({
        student: studentId,
        course: courseId,
    });

    if (!progress) {
        const error = new Error('Progress not found');
        error.statusCode = 404;
        throw error;
    }

    const alreadyCompleted = progress.completedLessons.some((lesson) =>lesson.toString() === lessonId);

    if (!alreadyCompleted) {
        progress.completedLessons.push(lessonId);
    }

    const totalLessons = await getTotalLessons(courseId);

    if (totalLessons > 0) {
        progress.completionPercentage = Math.round((progress.completedLessons.length /totalLessons) *100);
    }
    if (progress.completionPercentage === 100) {
        progress.completionStatus = 'completed';

        if (!progress.completedAt) {
            progress.completedAt = new Date();
        }
    }
    else if (progress.completedLessons.length > 0) {
        progress.completionStatus = 'in_progress';
    }

    await progress.save();
    return progress;
};

const updateLastAccessedLesson = async (validatedParams, authenticatedUser) => {
    const { courseId, lessonId } = validatedParams;
    const studentId = authenticatedUser._id;
    const enrolled = await Enrollment.findOne({
        student: studentId,
        course: courseId,
    });

    if (!enrolled) {
        const error = new Error('Student is not enrolled in the course');
        error.statusCode = 403;
        throw error;
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
        const error = new Error('Lesson not found');
        error.statusCode = 404;
        throw error;
    }

    const section = await Section.findById(lesson.section);

    if (!section) {
        const error = new Error('Section not found');
        error.statusCode = 404;
        throw error;
    }

    if (section.course.toString() !== courseId) {
        const error = new Error('Lesson does not belong to this course');
        error.statusCode = 400;
        throw error;
    }

    const progress = await Progress.findOne({
        student: studentId,
        course: courseId,
    });

    if (!progress) {
        const error = new Error('Progress not found');
        error.statusCode = 404;
        throw error;
    }

    progress.lastAccessedLesson = lessonId;
    await progress.save();
    return progress;
};

const getCourseProgress = async (validatedParams, authenticatedUser) => {
    const { courseId } = validatedParams;
    const studentId = authenticatedUser._id;
    const progress = await Progress.findOne({
        student: studentId,
        course: courseId,
    }).populate('course').populate('completedLessons').populate('lastAccessedLesson');

    if (!progress) {
        const error = new Error('Progress not found');
        error.statusCode = 404;
        throw error;
    }

    return {
        course: progress.course,
        completedLessons: progress.completedLessons,
        lastAccessedLesson: progress.lastAccessedLesson,
        percentage: progress.completionPercentage,
        status: progress.completionStatus,
    };
};

const getStudentProgress = async (authenticatedUser) => {
    const studentId = authenticatedUser._id;
    const progress = await Progress.find({
        student: studentId,
    }).populate('course').populate('lastAccessedLesson');

    return progress.map((item) => ({
        course: item.course,
        completedLessons: item.completedLessons,
        lastAccessedLesson: item.lastAccessedLesson,
        percentage: item.completionPercentage,
        status: item.completionStatus,
    }));
};


module.exports = {
    completeLesson,
    updateLastAccessedLesson,
    getCourseProgress,
    getStudentProgress,
};