const express = require('express');
const router = express.Router();
const wishlistController = require('./wishlist.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const {
    courseIdParamsSchema,
} = require('./wishlist.validation');

/**
 * @swagger
 * /wishlists/{courseId}:
 *   post:
 *     summary: Add course to wishlist
 *     tags: [Wishlists]
 *     security:
 *       - bearerAuth: []
 */
router.post(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    wishlistController.addToWishlist
);

/**
 * @swagger
 * /wishlists/{courseId}:
 *   delete:
 *     summary: Remove course from wishlist
 *     tags: [Wishlists]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
    '/:courseId',
    authMiddleware,
    authorizeMiddleware('student'),
    validateMiddleware(courseIdParamsSchema, 'params'),
    wishlistController.removeFromWishlist
);

/**
 * @swagger
 * /wishlists/me:
 *   get:
 *     summary: Get student's wishlist
 *     tags: [Wishlists]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    '/me',
    authMiddleware,
    authorizeMiddleware('student'),
    wishlistController.getMyWishlist
);



module.exports = router;