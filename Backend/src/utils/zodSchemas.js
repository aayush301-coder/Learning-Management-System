const { z } = require('zod');

const objectIdSchema = z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    'Invalid MongoDB ObjectId'
);

module.exports = {
    objectIdSchema,
};