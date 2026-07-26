const welcomeEmail = (name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Welcome to LMS</title>
    </head>

    <body>

        <div>

            <h2>
                Welcome to LMS, ${name}! 🎓
            </h2>

            <p>
                Your account has been created successfully.
            </p>

            <p>
                You can now explore courses, enroll, and start learning.
            </p>

            <br>

            <p>
                Happy Learning!
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

module.exports = welcomeEmail;