const asyncHandler = require('../../utils/asyncHandler');

const notificationService = require('./notification.service');


const getMyNotifications = asyncHandler(async (req, res) => {

    const result = await notificationService.getMyNotifications(req.validated.query, req.user);

    res.status(200).json({

        success: true,
        message: 'Notifications retrieved successfully',
        data: result,

    });

});


const markAsRead = asyncHandler(async (req, res) => {

    const notification = await notificationService.markAsRead(req.validated.params, req.user);

    res.status(200).json({

        success: true,
        message: 'Notification marked as read',
        data: notification,

    });

});


const markAllAsRead = asyncHandler(async (req, res) => {

    const result = await notificationService.markAllAsRead(req.user);

    res.status(200).json({

        success: true,
        message: 'All notifications marked as read',
        data: result,

    });

});


module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
};
