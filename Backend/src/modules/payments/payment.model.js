const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: 'INR',
        },

        gatewayOrderId: {
            type: String,
            default: null,
        },

        gatewayPaymentId: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
            index: true,
        },

        paymentMethod: {
            type: String,
            default: null,
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

paymentSchema.index({
    student: 1,
    course: 1,
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;