const Course = require('./course.model');
const slugify = require('slugify');

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

module.exports = {
    createCourse,
 };
    