const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const notificationController =
    require('./notification.controller');


const {
    notificationIdSchema,
} = require('./notification.validation');


// Get my notifications
router.get(
    '/',
    authMiddleware,
    notificationController.getMyNotifications
);


// Mark one notification read
router.patch(
    '/:notificationId/read',
    authMiddleware,
    validateMiddleware(
        notificationIdSchema,
        'params'
    ),
    notificationController.markNotificationAsRead
);


// Mark all read
router.patch(
    '/read-all',
    authMiddleware,
    notificationController.markAllNotificationsAsRead
);


// Delete notification
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