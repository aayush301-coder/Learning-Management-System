const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const corsOptions = require('./config/cors');
const errorMiddleware = require('./middlewares/error.middleware');

const authRouter = require('./modules/auth/auth.routes');
const userRouter = require('./modules/users/user.routes');
const courseRouter = require('./modules/courses/course.routes');
const sectionRouter = require('./modules/sections/section.routes');
const lessonRouter = require('./modules/lessons/lesson.routes');
const enrollmentRouter = require('./modules/enrollments/enrollment.routes');
const progressRouter = require('./modules/progress/progress.routes');
const reviewRouter = require('./modules/reviews/review.routes');
const notificationRouter = require('./modules/notifications/notification.routes');
const dashboardRouter = require('./modules/dashboard/dashboard.routes');
const uploadRouter = require('./modules/uploads/upload.routes');


const app = express();


app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {

    app.use(morgan('dev'));

}


app.get('/health', (req, res) => {

    res.status(200).json({ success: true, message: 'Okla API is running' });

});


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/sections', sectionRouter);
app.use('/api/v1/lessons', lessonRouter);
app.use('/api/v1/enrollments', enrollmentRouter);
app.use('/api/v1/progress', progressRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/uploads', uploadRouter);


app.use((req, res, next) => {

    const error = new Error(`Route not found: ${req.originalUrl}`);

    error.statusCode = 404;

    next(error);

});


app.use(errorMiddleware);


module.exports = app;
