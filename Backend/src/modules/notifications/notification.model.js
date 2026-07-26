const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },

        type: {
            type: String,
            enum: [
                'enrollment',
                'payment',
                'course',
                'certificate',
                'review',
                'system',
            ],
            required: true,
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },

        readAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);


notificationSchema.index({
    recipient: 1,
    createdAt: -1,
});


const Notification = mongoose.model(
    'Notification',
    notificationSchema
);


module.exports = Notification;