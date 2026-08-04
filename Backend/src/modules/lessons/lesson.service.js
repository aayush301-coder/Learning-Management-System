const Lesson = require('./lesson.model');
const Section = require('../sections/section.model');
const Course = require('../courses/course.model');


const findSectionWithCourseOrThrow = async (sectionId) => {

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

    return { section, course };

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


const getLessonsBySection = async (validatedParams) => {

    const lessons = await Lesson.find({ section: validatedParams.sectionId }).sort({ order: 1, createdAt: 1 });

    return lessons;

};


const createLesson = async (validatedParams, validatedBody, authenticatedUser) => {

    const { course } = await findSectionWithCourseOrThrow(validatedParams.sectionId);

    assertCourseOwnerOrAdmin(course, authenticatedUser);

    const lesson = await Lesson.create({

        ...validatedBody,
        section: validatedParams.sectionId,

    });

    return lesson;

};


const findLessonOrThrow = async (lessonId) => {

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {

        const error = new Error('Lesson not found');

        error.statusCode = 404;

        throw error;

    }

    return lesson;

};


const updateLesson = async (validatedParams, validatedBody, authenticatedUser) => {

    const lesson = await findLessonOrThrow(validatedParams.lessonId);

    const { course } = await findSectionWithCourseOrThrow(lesson.section);

    assertCourseOwnerOrAdmin(course, authenticatedUser);

    Object.assign(lesson, validatedBody);

    await lesson.save();

    return lesson;

};


const deleteLesson = async (validatedParams, authenticatedUser) => {

    const lesson = await findLessonOrThrow(validatedParams.lessonId);

    const { course } = await findSectionWithCourseOrThrow(lesson.section);

    assertCourseOwnerOrAdmin(course, authenticatedUser);

    await lesson.deleteOne();

    return { lessonId: validatedParams.lessonId };

};


module.exports = {
    getLessonsBySection,
    createLesson,
    updateLesson,
    deleteLesson,
};
