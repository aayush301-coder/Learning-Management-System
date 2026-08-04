const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const {
    getAllUsers,
    updateOwnProfile,
} = require('./user.controller');

const {
    getAllUsersSchema,
    updateOwnProfileSchema,
} = require('./user.validation');


router.get(
    '/',
    authMiddleware,
    authorizeMiddleware('admin'),
    validateMiddleware(getAllUsersSchema, 'query'),
    getAllUsers
);


router.patch(
    '/me',
    authMiddleware,
    authorizeMiddleware('student', 'instructor', 'admin'),
    validateMiddleware(updateOwnProfileSchema, 'body'),
    updateOwnProfile
);


module.exports = router;
