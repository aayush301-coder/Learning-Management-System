const smtpTransport = require('../config/mail');
const welcomeEmail = require('../templates/welcomeEmail');
const paymentReceiptEmail = require('../templates/paymentReceiptEmail');
const certificateEmail = require('../templates/certificateEmail');
const passwordResetEmail = require('../templates/passwordResetEmail');

const sendEmail = async ({
    to,
    subject,
    html,
    text,
}) => {

    await smtpTransport.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
        text,
    });

};

// Welcome Email
const sendWelcomeEmail = async (
    email,
    name
) => {

    await sendEmail({
        to: email,
        subject: 'Welcome to LMS',
        html: welcomeEmail(name),
        text: `Hello ${name}, welcome to LMS.`,
    });

};

// Payment Receipt Email
const sendPaymentReceiptEmail = async (
    email,
    name,
    paymentId,
    amount,
    courseTitle
) => {

    await sendEmail({
        to: email,
        subject: 'Payment Receipt - LMS',
        html: paymentReceiptEmail(
            name,
            paymentId,
            amount,
            courseTitle
        ),
        text:
            `Hello ${name}, your payment for ${courseTitle} was successful. Payment ID: ${paymentId}`,
    });

};

// Certificate Email
const sendCertificateEmail = async (
    email,
    name,
    courseTitle,
    certificateUrl
) => {

    await sendEmail({
        to: email,
        subject: 'Course Completion Certificate',
        html: certificateEmail(
            name,
            courseTitle,
            certificateUrl
        ),
        text:
            `Congratulations ${name}! Your certificate for ${courseTitle} is ready: ${certificateUrl}`,
    });

};

// Password Reset Email
const sendPasswordResetEmail = async (
    email,
    name,
    resetUrl
) => {

    await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        html: passwordResetEmail(
            name,
            resetUrl
        ),
        text:
            `Hello ${name}, reset your password using this link: ${resetUrl}`,
    });

};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendPaymentReceiptEmail,
    sendCertificateEmail,
    sendPasswordResetEmail,
};