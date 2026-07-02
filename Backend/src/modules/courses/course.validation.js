const { z } = require("zod");
const { courseCategories, courseLevels, courseLanguages, courseStatus } = require("../../constants/course.constants");

const createCourseSchema = z.object({
    title: z.string().trim().min(5, 'Course title must be at least 5 characters long').max(150, 'Course title cannot exceed 150 characters'),
    description: z.string().trim().min(10, 'Course description must be at least 10 characters long').max(5000, 'Course description cannot exceed 5000 characters'),
    thumbnail: z.string().trim().url({ message: 'Invalid thumbnail URL' }).optional(),
    category: z.enum(courseCategories, { message: 'Course category is not valid' }),
    level: z.enum(courseLevels, { message: 'Course level is not valid' }),
    language: z.enum(courseLanguages, { message: 'Course language is not valid' }),
    status: z.enum(courseStatus, { message: 'Course status is not valid' }),
    price: z.coerce.number().min(0, 'Course price cannot be negative'),
});

const updateCourseSchema = createCourseSchema.partial();

module.exports = {
    createCourseSchema,
    updateCourseSchema,
}
