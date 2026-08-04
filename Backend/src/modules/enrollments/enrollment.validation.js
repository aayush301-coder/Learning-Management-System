const { z } = require('zod');


const courseIdParamsSchema = z.object({

    courseId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid course id'),

});


module.exports = {
    courseIdParamsSchema,
};
