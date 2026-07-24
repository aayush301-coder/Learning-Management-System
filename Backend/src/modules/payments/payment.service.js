const Payment = require('./payment.model');
const Course = require('../courses/course.model');
const Enrollment = require('../enrollments/enrollment.model');


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

    const payment = await Payment.create({
        student: authenticatedUser._id,
        course: courseId,
        amount: course.price,
        currency: 'INR',
        gatewayOrderId: null,
        gatewayPaymentId: null,
        status: 'pending',
        paymentMethod: null,
        paidAt: null,
    });

    return payment;
};


const verifyPayment = async (validatedParams, authenticatedUser) => {
    const { paymentId } = validatedParams;

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
        const error = new Error('Payment is already processed');
        error.statusCode = 400;
        throw error;
    }

    const existingEnrollment = await Enrollment.findOne({
        student: payment.student,
        course: payment.course,
    });

    if (existingEnrollment) {
        const error = new Error('Student is already enrolled in this course');
        error.statusCode = 409;
        throw error;
    }

    payment.status = 'completed';
    payment.paidAt = new Date();

    await payment.save();

    const enrollment = await Enrollment.create({
        student: payment.student,
        course: payment.course,
    });

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