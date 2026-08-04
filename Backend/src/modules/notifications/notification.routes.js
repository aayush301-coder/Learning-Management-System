const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
} = require('./notification.controller');

const {
    getNotificationsSchema,
    notificationIdParamsSchema,
} = require('./notification.validation');


router.get(
    '/',
    authMiddleware,
    validateMiddleware(getNotificationsSchema, 'query'),
    getMyNotifications
);


router.patch(
    '/mark-all-read',
    authMiddleware,
    markAllAsRead
);


router.patch(
    '/:notificationId/read',
    authMiddleware,
    validateMiddleware(notificationIdParamsSchema, 'params'),
    markAsRead
);


module.exports = router;
