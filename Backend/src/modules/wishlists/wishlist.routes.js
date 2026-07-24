const express = require('express');

const router = express.Router();


const wishlistController = require('./wishlist.controller');

const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const {
    courseIdParamsSchema,
} = require('./wishlist.validation');



router.post(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    wishlistController.addToWishlist
);



router.delete(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    wishlistController.removeFromWishlist
);



router.get(
    '/me',
    authMiddleware,
    authorizeMiddleware('student'),
    wishlistController.getMyWishlist
);



module.exports = router;