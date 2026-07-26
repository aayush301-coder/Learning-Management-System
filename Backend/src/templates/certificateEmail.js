const certificateEmail = (
    name,
    courseTitle,
    certificateUrl
) => {

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Course Certificate</title>
    </head>


    <body>

        <div>

            <h2>
                Congratulations ${name}! 🎉
            </h2>


            <p>
                You have successfully completed:
            </p>


            <h3>
                ${courseTitle}
            </h3>


            <p>
                Your certificate has been generated.
            </p>


            <p>
                Click below to view your certificate:
            </p>


            <a href="${certificateUrl}">
                View Certificate
            </a>


            <br><br>


            <p>
                Keep learning and growing!
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

module.exports = certificateEmail;