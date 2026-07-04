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
                { instructor: authenticatedUser._id },
            ],
        };
    }

    return {};
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

module.exports = {
    createCourse,
    getAllCourses,
};