const { z } = require('zod');

const {
    courseCategories,
    courseLevels,
    courseLanguages,
    courseStatuses,
} = require('../../constants/course.constants');


const createCourseSchema = z.object({

    title: z
        .string()
        .trim()
        .min(5, 'Title must be at least 5 characters')
        .max(150, 'Title cannot exceed 150 characters'),

    description: z
        .string()
        .trim()
        .min(20, 'Description must be at least 20 characters'),

    thumbnail: z
        .string()
        .trim()
        .url('Invalid thumbnail URL')
        .optional(),

    category: z.enum(courseCategories, { message: 'Category is not valid' }),

    level: z.enum(courseLevels, { message: 'Level is not valid' }),

    language: z.enum(courseLanguages, { message: 'Language is not valid' }).default('english'),

    price: z.coerce
        .number()
        .min(0, 'Price cannot be negative')
        .default(0),

});


const updateCourseSchema = createCourseSchema.partial();


const getAllCoursesSchema = z.object({

    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(12),

    search: z.preprocess(
        (value) => value === '' ? undefined : value,
        z.string().trim().max(100).optional()
    ),

    category: z.preprocess(
        (value) => value === '' ? undefined : value,
        z.enum(courseCategories).optional()
    ),

    level: z.preprocess(
        (value) => value === '' ? undefined : value,
        z.enum(courseLevels).optional()
    ),

    status: z.preprocess(
        (value) => value === '' ? undefined : value,
        z.enum(courseStatuses).optional()
    ),

    instructor: z.preprocess(
        (value) => value === '' ? undefined : value,
        z.string().optional()
    ),

});


const courseIdParamsSchema = z.object({

    courseId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid course id'),

});


module.exports = {
    createCourseSchema,
    updateCourseSchema,
    getAllCoursesSchema,
    courseIdParamsSchema,
};
