const asyncHandler = require('../../utils/asyncHandler');
const notificationService = require('./notification.service');


const getMyNotifications = asyncHandler(
async (req,res)=>{

    const result =
        await notificationService.getMyNotifications(
            req.user
        );


    return res.status(200).json({
        success:true,
        message:'Notifications retrieved successfully',
        data:result,
    });

});


const markNotificationAsRead = asyncHandler(
async(req,res)=>{

    const result =
        await notificationService.markNotificationAsRead(
            req.validated.params,
            req.user
        );


    return res.status(200).json({
        success:true,
        message:'Notification marked as read',
        data:result,
    });

});


const markAllNotificationsAsRead = asyncHandler(
async(req,res)=>{

    await notificationService.markAllNotificationsAsRead(
        req.user
    );


    return res.status(200).json({
        success:true,
        message:'All notifications marked as read',
    });

});


const deleteNotification = asyncHandler(
async(req,res)=>{

    await notificationService.deleteNotification(
        req.validated.params,
        req.user
    );


    return res.status(200).json({
        success:true,
        message:'Notification deleted successfully',
    });

});


module.exports = {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};