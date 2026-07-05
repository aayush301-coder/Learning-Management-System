const { z } = require("zod");
const { courseCategories, courseLevels, courseLanguages, courseSortFields } = require("../../constants/course.constants");

const createCourseSchema = z.object({
    title: z.string().trim().min(5, 'Course title must be at least 5 characters long').max(150, 'Course title cannot exceed 150 characters'),
    description: z.string().trim().min(10, 'Course description must be at least 10 characters long').max(5000, 'Course description cannot exceed 5000 characters'),
    thumbnail: z.string().trim().url({ message: 'Invalid thumbnail URL' }).optional(),
    category: z.enum(courseCategories, { message: 'Course category is not valid' }),
    level: z.enum(courseLevels, { message: 'Course level is not valid' }),
    language: z.enum(courseLanguages, { message: 'Course language is not valid' }),
    price: z.coerce.number().min(0, 'Course price cannot be negative'),
});

const updateCourseSchema = createCourseSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
    });

const getAllCoursesSchema = z.object({
    page: z.coerce.number().min(1, 'Page number must be positive').default(1),
    limit: z.coerce.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10),
    search: z.preprocess((value) => value === '' ? undefined : value, z.string().trim().max(100, 'Search query cannot exceed 100 characters').optional()),
    category: z.enum(courseCategories, { message: 'Course category is not valid' }).optional(),
    level: z.enum(courseLevels, { message: 'Course level is not valid' }).optional(),
    language: z.enum(courseLanguages, { message: 'Course language is not valid' }).optional(),
    sortBy: z.enum(courseSortFields, { message: 'Invalid sort field' }).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc'], { message: 'Invalid sort order' }).default('desc'),
});

const getCourseByIdSchema = z.object({
    courseId: z.string().regex(
        /^[0-9a-fA-F]{24}$/,
        'Invalid course ID'
    ),
});

const submitCourseForReviewSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
        message: 'Invalid course ID',
    }),
});

const publishCourseSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
        message: 'Invalid course ID',
    }),
});

const unpublishCourseSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
        message: 'Invalid course ID',
    }),
});

module.exports = {
    createCourseSchema,
    updateCourseSchema,
    getAllCoursesSchema,
    getCourseByIdSchema,
    submitCourseForReviewSchema,
    publishCourseSchema,
    unpublishCourseSchema,
}
