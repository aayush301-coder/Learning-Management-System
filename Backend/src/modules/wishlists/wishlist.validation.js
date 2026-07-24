const { z } = require('zod');


const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');


const courseIdParamsSchema = z.object({
    courseId: objectIdSchema,
});


module.exports = {
    courseIdParamsSchema,
};