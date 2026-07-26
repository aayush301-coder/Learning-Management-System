const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const notificationController = require('./notification.controller');
const {
    notificationIdSchema,
} = require('./notification.validation');

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get My Notifications for a student
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    '/',
    authMiddleware,
    notificationController.getMyNotifications
);

/**
 * @swagger
 * /notifications/:notificationId/read:
 *   patch:
 *     summary: Mark a notification for a student as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    '/:notificationId/read',
    authMiddleware,
    validateMiddleware(
        notificationIdSchema,
        'params'
    ),
    notificationController.markNotificationAsRead
);

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Mark My Notifications for a student as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    '/read-all',
    authMiddleware,
    notificationController.markAllNotificationsAsRead
);

/**
 * @swagger
 * /notifications/:notificationId:
 *   delete:
 *     summary: Delete a notification for a student
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
    '/:notificationId',
    authMiddleware,
    validateMiddleware(
        notificationIdSchema,
        'params'
    ),
    notificationController.deleteNotification
);

module.exports = router;