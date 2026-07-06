const Course = require('./course.model');
const slugify = require('slugify');


// Private Helper Functions

const generateUniqueSlug = async (title) => {
    const baseSlug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
    });

    let slug = baseSlug;
    let counter = 2;

    while (await Course.findOne({ slug }).lean()) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

const canManageCourse = (course, authenticatedUser) => {
    if (authenticatedUser.role === 'admin') {
        return true;
    }
    if (authenticatedUser.role === 'instructor') {
        return course.instructor.toString() === authenticatedUser._id.toString();
    }

    return false;
};

const canViewCourse = (course, authenticatedUser) => {
    if (authenticatedUser.role === 'admin') {
        return true;
    }
    if (course.status === 'archived') {
        return canManageCourse(course, authenticatedUser);
    }
    if (authenticatedUser.role === 'student') {
        return course.status === 'published';
    }
    if (authenticatedUser.role === 'instructor') {
        return course.instructor.toString() === authenticatedUser._id.toString() || course.status === 'published';
    }
    return false;
};

const buildVisibilityFilter = (authenticatedUser) => {
    if (authenticatedUser.role === 'admin') {
        return {};
    }
    if (authenticatedUser.role === 'student') {
        return {
            status: 'published',
        };
    }
    if (authenticatedUser.role === 'instructor') {
        return {
            $or: [
                { status: 'published' },
                {
                    instructor: authenticatedUser._id,
                    status: { $ne: 'archived' },
                },
            ],
        };
    }

    return {
        _id: null,
    };
};

const buildSearchFilter = (search) => {
    if (!search) {
        return {};
    }

    return {
        title: {
            $regex: search,
            $options: 'i',
        },
    };
};

const buildCourseFilter = (validatedQuery) => {
    const { category, level, language } = validatedQuery;
    const filter = {};

    if (category) {
        filter.category = category;
    }
    if (level) {
        filter.level = level;
    }
    if (language) {
        filter.language = language;
    }

    return filter;
};

const buildSort = (sortBy, sortOrder) => {
    return {
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
};


// Exported Service Functions

const createCourse = async (validatedCourseData, authenticatedUserId) => {
    const slug = await generateUniqueSlug(validatedCourseData.title);

    const course = new Course({
        ...validatedCourseData,
        slug,
        instructor: authenticatedUserId,
    });

    await course.save();
    return course;
};

const getAllCourses = async (validatedQuery, authenticatedUser) => {
    const {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
    } = validatedQuery;

    const skip = (page - 1) * limit;

    const visibilityFilter = buildVisibilityFilter(authenticatedUser);
    const searchFilter = buildSearchFilter(search);
    const courseFilter = buildCourseFilter(validatedQuery);
    const sort = buildSort(sortBy, sortOrder);

    const filter = {
        ...visibilityFilter,
        ...searchFilter,
        ...courseFilter,
    };

    const totalDocuments = await Course.countDocuments(filter);
    const courses = await Course.find(filter).sort(sort).skip(skip).limit(limit).lean();
    const totalPages = totalDocuments > 0 ? Math.ceil(totalDocuments / limit) : 0;

    return {
        courses,
        pagination: {
            currentPage: page,
            pageSize: limit,
            totalDocuments,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
};

const getMyCourses = async (validatedQuery, authenticatedUser) => {
    const {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        status,
        category,
        level,
    } = validatedQuery;
    const skip = (page - 1) * limit;
    const baseFilter = {
        instructor: authenticatedUser._id,
    };

    if (status) {
        baseFilter.status = status;
    }
    if (category) {
        baseFilter.category = category;
    }
    if (level) {
        baseFilter.level = level;
    }

    const searchFilter = search ? {
              $or: [
                  { title: { $regex: search, $options: 'i' } },
                  { description: { $regex: search, $options: 'i' } },
              ],
    }
    : {};
    const filter = {
        ...baseFilter,
        ...searchFilter,
    };
    const sort = {
        [sortBy]: sortOrder === 'desc' ? -1 : 1,
    };
    const totalDocuments = await Course.countDocuments(filter);
    const courses = await Course.find(filter).sort(sort).skip(skip).limit(limit).lean();
    const totalPages = Math.ceil(totalDocuments / limit);

    return {
        courses,
        pagination: {
            page,
            limit,
            totalDocuments,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
};

const getCourseById = async (validatedParams, authenticatedUser) => {
    const { courseId } = validatedParams;
    const course = await Course.findById(courseId).lean();

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if (!canViewCourse(course, authenticatedUser)) {
        const error = new Error('You are not authorized to access this course');
        error.statusCode = 403;
        throw error;
    }

    return course;
};

const updateCourse = async (validatedParams, validatedCourseData, authenticatedUser) => {
    const { courseId } = validatedParams;
    const course = await Course.findById(courseId);

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if (course.status === 'archived') {
        const error = new Error('Archived courses cannot be updated');
        error.statusCode = 409;
        throw error;
    }
    if (!canManageCourse(course, authenticatedUser)) {
        const error = new Error('You are not authorized to update this course');
        error.statusCode = 403;
        throw error;
    }
    if(validatedCourseData.title && validatedCourseData.title !== course.title) {
        validatedCourseData.title = validatedCourseData.title.trim();
        const newSlug = await generateUniqueSlug(validatedCourseData.title);
        validatedCourseData.slug = newSlug;
    }

    course.set(validatedCourseData);
    await course.save();
    return course;
};

const deleteCourse = async (validatedParams, authenticatedUser) => {
    const { courseId } = validatedParams;
    const course = await Course.findById(courseId);

    if(!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if(!canManageCourse(course, authenticatedUser)) {
        const error = new Error('You are not authorized to delete this course');
        error.statusCode = 403;
        throw error;
    }
    await course.deleteOne();
    return;
};

const submitCourseForReview = async (validatedParams, authenticatedUser) => {
    const { courseId } = validatedParams;
    const course = await Course.findById(courseId);

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if (course.instructor.toString() !== authenticatedUser._id.toString()) {
        const error = new Error('You are not authorized to submit this course');
        error.statusCode = 403;
        throw error;
    }
    if (course.status !== 'draft') {
        const error = new Error(`Course cannot be submitted for review from status: ${course.status}`);
        error.statusCode = 409;
        throw error;
    }
    course.status = 'pending_review';
    await course.save();
    return course;
};

const publishCourse = async (validatedParams, authenticatedUser) => {
    const { courseId } = validatedParams;
    const course = await Course.findById(courseId);

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if (authenticatedUser.role !== 'admin') {
        const error = new Error('Only admin can publish courses');
        error.statusCode = 403;
        throw error;
    }
    if (course.status !== 'pending_review' && course.status !== 'unpublished') {
        const error = new Error(`Only courses in pending_review or are unpublished can be published. Current status: ${course.status}`);
        error.statusCode = 409;
        throw error;
    }

    course.status = 'published';
    await course.save();
    return course;
};

const unpublishCourse = async (validatedParams, authenticatedUser) => {
    const { courseId } = validatedParams;
    const course = await Course.findById(courseId);
    
    if(!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if(!canManageCourse(course, authenticatedUser)) {
        const error = new Error('You are not authorized to unpublish this course');
        error.statusCode = 403;
        throw error;
    }
    if(course.status !== 'published') {
        const error = new Error(`Only published courses can be unpublished. Current status: ${course.status}`);
        error.statusCode = 409;
        throw error;
    }

    course.status = 'unpublished';
    await course.save();
    return course;
};

const archiveCourse = async (validatedParams, authenticatedUser) => {
    const { courseId } = validatedParams;
    const course = await Course.findById(courseId);

    if(!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if(authenticatedUser.role !== 'admin') {
        const error = new Error('You are not authorized to archive the course');
        error.statusCode = 403;
        throw error;
    }
    if(course.status === 'archived') {
        const error = new Error(`Course is already archived. Current status: ${course.status}`);
        error.statusCode = 409;
        throw error;
    }

    course.status = 'archived';
    await course.save();
    return course;
};

const restoreArchivedCourse = async (validatedParams, authenticatedUser) => {
    const { courseId } = validatedParams;
    const course = await Course.findById(courseId);
    
    if(!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }
    if(authenticatedUser.role !== 'admin') {
        const error = new Error('You are not authorized to restore this course');
        error.statusCode = 403;
        throw error;
    }
    if(course.status !== 'archived') {
        const error = new Error(`Only archived courses can be restored. Current status: ${course.status}`);
        error.statusCode = 409;
        throw error;
    }

    course.status = 'unpublished';
    await course.save();
    return course;
}

module.exports = {
    createCourse,
    getAllCourses,
    getMyCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    submitCourseForReview,
    publishCourse,
    unpublishCourse,
    archiveCourse,
    restoreArchivedCourse,
};