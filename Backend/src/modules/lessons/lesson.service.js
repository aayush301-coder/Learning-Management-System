const Lesson = require('./lesson.model');
const Section = require('../sections/section.model');
const Course = require('../courses/course.model');
const { canManageCourse, canViewCourse } = require('../courses/course.service');

const createLesson = async (params, body, user) => {
    const { sectionId } = params;
    const { title, description, videoUrl, duration, isPreview } = body;
    const section = await Section.findById(sectionId);

    if (!section) {
        const error = new Error('Section not found');
        error.statusCode = 404;
        throw error;
    }

    const course = await Course.findById(section.course);

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if (!canManageCourse(course, user)) {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    const lastLesson = await Lesson.findOne({ section: sectionId }).sort({ order: -1 });
    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;
    const lesson = await Lesson.create({
        title,
        description,
        section: sectionId,
        order: nextOrder,
        videoUrl,
        duration,
        isPreview,
    });
    return lesson;
};

const getLessonsBySection = async (params, user) => {
    const { sectionId } = params;
    const section = await Section.findById(sectionId);

    if (!section) {
        const error = new Error('Section not found');
        error.statusCode = 404;
        throw error;
    }

    const course = await Course.findById(section.course);

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if (!canViewCourse(course, user)) {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    const lessons = await Lesson.find({ section: sectionId }).sort({ order: 1 });
    return lessons;
};

const getLessonById = async (params, user) => {
    const { lessonId } = params;
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

    const course = await Course.findById(section.course);

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if (!canViewCourse(course, user)) {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    return lesson;
};

const updateLesson = async (params, body, user) => {
    const { lessonId } = params;
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

    const course = await Course.findById(section.course);

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if (!canManageCourse(course, user)) {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    lesson.set(body);
    await lesson.save();
    return lesson;
};

const deleteLesson = async (params, user) => {
    const { lessonId } = params;
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

    const course = await Course.findById(section.course);

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if (!canManageCourse(course, user)) {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    await lesson.deleteOne();
    return { message: 'Lesson deleted successfully' };
};

module.exports = {
    createLesson,
    getLessonsBySection,
    getLessonById,
    updateLesson,
    deleteLesson,
}