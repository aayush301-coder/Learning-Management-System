const Course = require('./course.model');
const notificationService = require('../notifications/notification.service');


const buildPaginationMeta = (page, limit, totalDocuments) => {

    const totalPages = totalDocuments > 0 ? Math.ceil(totalDocuments / limit) : 0;

    return {

        currentPage: page,
        pageSize: limit,
        totalDocuments,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,

    };

};


const getAllCourses = async (validatedQuery, authenticatedUser) => {

    const { page, limit, search, category, level, status, instructor } = validatedQuery;

    const skip = (page - 1) * limit;

    const filter = {};

    // Students and unauthenticated visitors only ever see published
    // courses. Instructors/admins may pass an explicit status filter
    // to see their own drafts, pending review, etc.
    if (!authenticatedUser || authenticatedUser.role === 'student') {

        filter.status = 'published';

    }
    else if (status) {

        filter.status = status;

    }

    if (category) {

        filter.category = category;

    }

    if (level) {

        filter.level = level;

    }

    if (instructor) {

        filter.instructor = instructor;

    }

    if (search) {

        filter.$text = { $search: search };

    }

    const totalDocuments = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
        .populate('instructor', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    return {

        courses,
        pagination: buildPaginationMeta(page, limit, totalDocuments),

    };

};


const getMyCourses = async (validatedQuery, authenticatedUser) => {

    const { page, limit, search, category, level, status } = validatedQuery;

    const skip = (page - 1) * limit;

    // Own-courses view: instructor sees every status of their own
    // courses (no forced published-only restriction here).
    const filter = { instructor: authenticatedUser._id };

    if (status) {

        filter.status = status;

    }

    if (category) {

        filter.category = category;

    }

    if (level) {

        filter.level = level;

    }

    if (search) {

        filter.$text = { $search: search };

    }

    const totalDocuments = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
        .populate('instructor', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    return {

        courses,
        pagination: buildPaginationMeta(page, limit, totalDocuments),

    };

};


const findCourseOrThrow = async (courseId) => {

    const course = await Course.findById(courseId).populate('instructor', 'name email avatar');

    if (!course) {

        const error = new Error('Course not found');

        error.statusCode = 404;

        throw error;

    }

    return course;

};


const getCourseById = async (validatedParams, authenticatedUser) => {

    const course = await findCourseOrThrow(validatedParams.courseId);

    const isOwner = authenticatedUser && course.instructor._id.toString() === authenticatedUser._id.toString();
    const isAdmin = authenticatedUser && authenticatedUser.role === 'admin';

    if (course.status !== 'published' && !isOwner && !isAdmin) {

        const error = new Error('Course not found');

        error.statusCode = 404;

        throw error;

    }

    return course;

};


const createCourse = async (validatedBody, authenticatedUser) => {

    const course = await Course.create({

        ...validatedBody,
        instructor: authenticatedUser._id,

    });

    return course;

};


const assertOwnerOrAdmin = (course, authenticatedUser) => {

    const isOwner = course.instructor._id
        ? course.instructor._id.toString() === authenticatedUser._id.toString()
        : course.instructor.toString() === authenticatedUser._id.toString();

    const isAdmin = authenticatedUser.role === 'admin';

    if (!isOwner && !isAdmin) {

        const error = new Error('You are not authorized to modify this course');

        error.statusCode = 403;

        throw error;

    }

};


const updateCourse = async (validatedParams, validatedBody, authenticatedUser) => {

    const course = await findCourseOrThrow(validatedParams.courseId);

    assertOwnerOrAdmin(course, authenticatedUser);

    Object.assign(course, validatedBody);

    await course.save();

    return course;

};


const deleteCourse = async (validatedParams, authenticatedUser) => {

    const course = await findCourseOrThrow(validatedParams.courseId);

    assertOwnerOrAdmin(course, authenticatedUser);

    if (course.status === 'published') {

        const error = new Error('Published courses cannot be deleted. Unpublish or archive it first.');

        error.statusCode = 400;

        throw error;

    }

    await course.deleteOne();

    return { courseId: validatedParams.courseId };

};


const submitForReview = async (validatedParams, authenticatedUser) => {

    const course = await findCourseOrThrow(validatedParams.courseId);

    assertOwnerOrAdmin(course, authenticatedUser);

    if (course.status !== 'draft') {

        const error = new Error('Only draft courses can be submitted for review');

        error.statusCode = 400;

        throw error;

    }

    course.status = 'pending_review';

    await course.save();

    return course;

};


const publishCourse = async (validatedParams) => {

    const course = await findCourseOrThrow(validatedParams.courseId);

    // Admin-only action (enforced at the route level) — admins can
    // publish a course directly from any status, including draft,
    // rather than being forced through the instructor submit-for-
    // review step first.
    if (course.status === 'published') {

        const error = new Error('This course is already published');

        error.statusCode = 400;

        throw error;

    }

    course.status = 'published';

    await course.save();

    await notificationService.createNotification({

        userId: course.instructor._id || course.instructor,
        title: 'Course published',
        message: `Your course "${course.title}" is now live and visible to students.`,
        type: 'course_status',

    });

    return course;

};


const unpublishCourse = async (validatedParams, authenticatedUser) => {

    const course = await findCourseOrThrow(validatedParams.courseId);

    assertOwnerOrAdmin(course, authenticatedUser);

    if (course.status !== 'published') {

        const error = new Error('Only published courses can be unpublished');

        error.statusCode = 400;

        throw error;

    }

    course.status = 'unpublished';

    await course.save();

    return course;

};


const archiveCourse = async (validatedParams) => {

    const course = await findCourseOrThrow(validatedParams.courseId);

    // Admin-only action (enforced at the route level) — admins can
    // archive a course from any status, including draft.
    if (course.status === 'archived') {

        const error = new Error('This course is already archived');

        error.statusCode = 400;

        throw error;

    }

    course.status = 'archived';

    await course.save();

    return course;

};


const restoreArchivedCourse = async (validatedParams) => {

    const course = await findCourseOrThrow(validatedParams.courseId);

    if (course.status !== 'archived') {

        const error = new Error('Only archived courses can be restored');

        error.statusCode = 400;

        throw error;

    }

    course.status = 'unpublished';

    await course.save();

    return course;

};


module.exports = {
    getAllCourses,
    getMyCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    submitForReview,
    publishCourse,
    unpublishCourse,
    archiveCourse,
    restoreArchivedCourse,
};
