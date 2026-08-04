const Section = require('./section.model');
const Course = require('../courses/course.model');


const findCourseOrThrow = async (courseId) => {

    const course = await Course.findById(courseId);

    if (!course) {

        const error = new Error('Course not found');

        error.statusCode = 404;

        throw error;

    }

    return course;

};


const assertCourseOwnerOrAdmin = (course, authenticatedUser) => {

    const isOwner = course.instructor.toString() === authenticatedUser._id.toString();
    const isAdmin = authenticatedUser.role === 'admin';

    if (!isOwner && !isAdmin) {

        const error = new Error('You are not authorized to manage this course\'s content');

        error.statusCode = 403;

        throw error;

    }

};


const getSectionsByCourse = async (validatedParams) => {

    const sections = await Section.find({ course: validatedParams.courseId }).sort({ order: 1, createdAt: 1 });

    return sections;

};


const createSection = async (validatedParams, validatedBody, authenticatedUser) => {

    const course = await findCourseOrThrow(validatedParams.courseId);

    assertCourseOwnerOrAdmin(course, authenticatedUser);

    const section = await Section.create({

        ...validatedBody,
        course: course._id,

    });

    return section;

};


const findSectionOrThrow = async (sectionId) => {

    const section = await Section.findById(sectionId);

    if (!section) {

        const error = new Error('Section not found');

        error.statusCode = 404;

        throw error;

    }

    return section;

};


const updateSection = async (validatedParams, validatedBody, authenticatedUser) => {

    const section = await findSectionOrThrow(validatedParams.sectionId);

    const course = await findCourseOrThrow(section.course);

    assertCourseOwnerOrAdmin(course, authenticatedUser);

    Object.assign(section, validatedBody);

    await section.save();

    return section;

};


const deleteSection = async (validatedParams, authenticatedUser) => {

    const section = await findSectionOrThrow(validatedParams.sectionId);

    const course = await findCourseOrThrow(section.course);

    assertCourseOwnerOrAdmin(course, authenticatedUser);

    await section.deleteOne();

    return { sectionId: validatedParams.sectionId };

};


module.exports = {
    getSectionsByCourse,
    createSection,
    updateSection,
    deleteSection,
    findCourseOrThrow,
    assertCourseOwnerOrAdmin,
};
