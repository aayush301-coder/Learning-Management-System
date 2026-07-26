const Notification = require('./notification.model');


const createNotification = async (data) => {

    const notification = await Notification.create(data);

    return notification;
};


const getMyNotifications = async (authenticatedUser) => {

    const notifications = await Notification.find({
        recipient: authenticatedUser._id,
    })
        .sort({
            createdAt: -1,
        })
        .lean();


    return notifications;
};


const markNotificationAsRead = async (
    validatedParams,
    authenticatedUser
) => {

    const notification =
        await Notification.findOne({
            _id: validatedParams.notificationId,
            recipient: authenticatedUser._id,
        });


    if (!notification) {
        const error = new Error(
            'Notification not found'
        );
        error.statusCode = 404;
        throw error;
    }


    if (!notification.isRead) {

        notification.isRead = true;
        notification.readAt = new Date();

        await notification.save();
    }


    return notification;
};



const markAllNotificationsAsRead = async (
    authenticatedUser
) => {

    await Notification.updateMany(
        {
            recipient: authenticatedUser._id,
            isRead: false,
        },
        {
            isRead: true,
            readAt: new Date(),
        }
    );


    return true;
};



const deleteNotification = async (
    validatedParams,
    authenticatedUser
) => {

    const notification =
        await Notification.findOne({
            _id: validatedParams.notificationId,
            recipient: authenticatedUser._id,
        });


    if (!notification) {
        const error = new Error(
            'Notification not found'
        );
        error.statusCode = 404;
        throw error;
    }


    await notification.deleteOne();

    return;
};



module.exports = {
    createNotification,
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};