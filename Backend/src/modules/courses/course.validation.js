const { z } = require("zod");

const createCourseSchema = z.object({
    title: z.string().trim().min(5, 'Course title must be at least 5 characters long').max(150, 'Course title cannot exceed 150 characters'),
    description: z.string().trim().min(10, 'Course description must be at least 10 characters long').max(5000, 'Course description cannot exceed 5000 characters'),
    thumbnail: z.string().trim().url({ message: 'Invalid thumbnail URL' }).optional(),
    category: z.enum(['web_development','mobile_development','data_science','artificial_intelligence','machine_learning','cyber_security','cloud_computing','devops','programming_languages','database','ui_ux_design', 'business','marketing','productivity'], { message: 'Course category is not valid' }),
    level: z.enum(['beginner','intermediate','advanced'], { message: 'Course level is not valid' }),
    language: z.enum(['english','hindi','spanish','french'], { message: 'Course language is not valid' }),
    price: z.coerce.number().min(0, 'Course price cannot be negative'),
});

const updateCourseSchema = createCourseSchema.partial();

module.exports = {
    createCourseSchema,
    updateCourseSchema,
}
