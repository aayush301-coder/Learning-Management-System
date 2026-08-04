const Notification = require('./notification.model');


// Reusable helper other modules call to notify a user (e.g. course
// published, enrollment confirmed). Intentionally does not throw on
// failure paths the caller doesn't need to handle transactionally.
const createNotification = async ({ userId, title, message, type = 'system' }) => {

    return Notification.create({

        user: userId,
        title,
        message,
        type,

    });

};


const getMyNotifications = async (validatedQuery, authenticatedUser) => {

    const { page, limit, isRead } = validatedQuery;

    const skip = (page - 1) * limit;

    const filter = { user: authenticatedUser._id };

    if (isRead !== undefined) {

        filter.isRead = isRead === 'true';

    }

    const totalDocuments = await Notification.countDocuments(filter);

    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const unreadCount = await Notification.countDocuments({
        user: authenticatedUser._id,
        isRead: false,
    });

    return {

        notifications,
        unreadCount,
        pagination: {
            currentPage: page,
            pageSize: limit,
            totalDocuments,
            totalPages: totalDocuments > 0 ? Math.ceil(totalDocuments / limit) : 0,
        },

    };

};


const markAsRead = async (validatedParams, authenticatedUser) => {

    const notification = await Notification.findOne({
        _id: validatedParams.notificationId,
        user: authenticatedUser._id,
    });

    if (!notification) {

        const error = new Error('Notification not found');

        error.statusCode = 404;

        throw error;

    }

    notification.isRead = true;

    await notification.save();

    return notification;

};


const markAllAsRead = async (authenticatedUser) => {

    await Notification.updateMany(
        { user: authenticatedUser._id, isRead: false },
        { isRead: true }
    );

    return { success: true };

};


module.exports = {
    createNotification,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
};
