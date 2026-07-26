const passwordResetEmail = (
    name,
    resetUrl
) => {

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Reset</title>
    </head>


    <body>

        <div>

            <h2>
                Password Reset Request
            </h2>


            <p>
                Hello ${name},
            </p>


            <p>
                We received a request to reset your LMS password.
            </p>


            <p>
                Click the link below to reset your password:
            </p>


            <a href="${resetUrl}">
                Reset Password
            </a>


            <br><br>


            <p>
                If you did not request this, ignore this email.
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

module.exports = passwordResetEmail;