const Section = require('./section.model');
const Course = require('../courses/course.model');
const { canManageCourse, canViewCourse } = require('../courses/course.service');

const createSection = async (params, body, user) => {
    const { courseId } = params;
    const { title, description } = body;
    const course = await Course.findById(courseId);

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

    const lastSection = await Section.findOne({ course: courseId }).sort({ order: -1 });
    const nextOrder = lastSection ? lastSection.order + 1 : 1;
    const section = await Section.create({
        title,
        description,
        course: courseId,
        order: nextOrder,
    });
    return section;
};

const getSectionsByCourse = async (params, user) => {
    const { courseId } = params;
    const course = await Course.findById(courseId);

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

    const sections = await Section.find({ course: courseId }).sort({ order: 1 });
    return sections;
};

const getSectionById = async (params, user) => {
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

    return section;
};

const updateSection = async (params, body, user) => {
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
    if (!canManageCourse(course, user)) {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    section.set(body);
    await section.save();
    return section;
};

const deleteSection = async (params, user) => {
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
    if (!canManageCourse(course, user)) {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    await section.deleteOne();
    return { message: 'Section deleted successfully' };
};

module.exports = {
    createSection,
    getSectionsByCourse,
    getSectionById,
    updateSection,
    deleteSection
};
