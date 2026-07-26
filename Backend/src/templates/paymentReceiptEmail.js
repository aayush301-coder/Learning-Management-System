const paymentReceiptEmail = (
    name,
    paymentId,
    amount,
    courseTitle
) => {

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Payment Receipt</title>
    </head>

    <body>
        <div>
            <h2>
                Payment Successful ✅
            </h2>

            <p>
                Hello ${name},
            </p>

            <p>
                Your payment has been completed successfully.
            </p>

            <p>
                Course:
                <strong>${courseTitle}</strong>
            </p>

            <p>
                Payment ID:
                <strong>${paymentId}</strong>
            </p>

            <p>
                Amount Paid:
                <strong>₹${amount}</strong>
            </p>
            
            <br>

            <p>
                You can now access your course.
            </p>

            <p>
                Regards,<br>
                LMS Team
            </p>
        </div>
    </body>
    </html>
    `;
};

module.exports = paymentReceiptEmail;