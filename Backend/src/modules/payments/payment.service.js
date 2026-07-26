const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('./payment.model');
const Course = require('../courses/course.model');
const Enrollment = require('../enrollments/enrollment.model');
const notificationService = require('../notifications/notification.service');
const emailService = require('../../services/email.service');
const User = require('../users/user.model');
const mongoose = require('mongoose');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPaymentOrder = async (validatedParams, authenticatedUser) => {
    const { courseId } = validatedParams;

    const course = await Course.findOne({
        _id: courseId,
        status: 'published',
    });

    if (!course) {
        const error = new Error('Course not found or not available');
        error.statusCode = 404;
        throw error;
    }

    const existingEnrollment = await Enrollment.findOne({
        student: authenticatedUser._id,
        course: courseId,
    });

    if (existingEnrollment) {
        const error = new Error('Student is already enrolled in this course');
        error.statusCode = 409;
        throw error;
    }

    const existingPayment = await Payment.findOne({
        student: authenticatedUser._id,
        course: courseId,
        status: 'pending',
    });

    if (existingPayment) {
        const error = new Error('Student has already paid for this course');
        error.statusCode = 409;
        throw error;
    }

    const courseIdShort = courseId.toString().slice(-4);
    const studentIdShort = authenticatedUser._id.toString().slice(-4);
    const timeStamp = Date.now().toString(36);
    const razorpayOrder = await razorpay.orders.create({
        amount: course.price * 100,
        currency: 'INR',
        receipt: `c${courseIdShort}_s${studentIdShort}_${timeStamp}`,
    });

    const razorpayOrderId = razorpayOrder.id;
    const payment = await Payment.create({
        student: authenticatedUser._id,
        course: courseId,
        gatewayOrderId: razorpayOrderId,
        gatewayPaymentId: null,
        amount: course.price,
        currency: 'INR',
        status: 'pending',
        signature: null,
        paymentMethod: null,
        paidAt: null,
    });

    return {
        payment,
        razorpayOrderId,
        amount: course.price,
        currency: 'INR',
    };
};

const verifyPayment = async (validatedParams, validatedBody, authenticatedUser) => {
    const { paymentId } = validatedParams;
    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
    } = validatedBody;

    const payment = await Payment.findOne({
        _id: paymentId,
        student: authenticatedUser._id,
    });

    if (!payment) {
        const error = new Error('Payment not found');
        error.statusCode = 404;
        throw error;
    }
    if (payment.status !== 'pending') {
        const error = new Error('Payment already processed');
        error.statusCode = 400;
        throw error;
    }
    if (payment.gatewayOrderId !== razorpay_order_id) {
        const error = new Error('Invalid Razorpay order ID');
        error.statusCode = 400;
        throw error;
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
        const error = new Error('Invalid payment signature');
        error.statusCode = 400;
        throw error;
    }

    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

    if (razorpayPayment.amount !== payment.amount * 100) {
        const error = new Error('Invalid payment amount');
        error.statusCode = 400;
        throw error;
    }
    if (razorpayPayment.currency !== payment.currency) {
        const error = new Error('Invalid payment currency');
        error.statusCode = 400;
        throw error;
    }
    if (razorpayPayment.status !== 'captured') {
        const error = new Error('Payment not captured');
        error.statusCode = 400;
        throw error;
    }

    const course = await Course.findById(payment.course);

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }

    const existingEnrollment = await Enrollment.findOne({
            student: payment.student,
            course: payment.course,
        });

    if (existingEnrollment) {
        const error = new Error('Student already enrolled');
        error.statusCode = 409;
        throw error;
    }

    const session = await mongoose.startSession();
    let enrollment;

    try {
        session.startTransaction();

        payment.gatewayPaymentId = razorpay_payment_id;
        payment.signature = razorpay_signature;
        payment.paymentMethod = razorpayPayment.method;
        payment.status = 'completed';
        payment.paidAt = new Date();

        await payment.save({ session });

        const createdEnrollment = await Enrollment.create(
                [
                    {
                        student: payment.student,
                        course: payment.course,
                    }
                ],
                {
                    session,
                }
            );
        enrollment = createdEnrollment[0];
        await session.commitTransaction();
    } catch(error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }

    await notificationService.createNotification({
        recipient: payment.student,
        title: 'Payment Successful',
        message: `Your payment for ${course.title} was successful.`,
        type: 'payment',
        referenceId: payment._id,
    });

    const student = await User.findById(payment.student);

    try {
        await emailService.sendPaymentReceiptEmail(
            student.email,
            student.name,
            payment._id,
            payment.amount,
            course.title
        );
    } catch(error) {
        console.log(
            'Payment email failed:',
            error.message
        );
    }

    return {
        payment,
        enrollment,
    };
};

const getMyPayments = async (authenticatedUser) => {
    const payments = await Payment.find({
        student: authenticatedUser._id,
    })
        .populate('course', 'title thumbnail price')
        .sort({
            createdAt: -1,
        });

    return payments;
};


module.exports = {
    createPaymentOrder,
    verifyPayment,
    getMyPayments,
};