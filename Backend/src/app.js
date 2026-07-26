const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');
const helmet = require('helmet');
const authRouter = require('./modules/auth/auth.routes');
const courseRouter = require('./modules/courses/course.routes');
const sectionRouter = require('./modules/sections/section.routes');
const lessonRouter = require('./modules/lessons/lesson.routes');
const enrollmentRouter = require('./modules/enrollments/enrollment.routes');
const progressRouter = require('./modules/progress/progress.routes');
const reviewRouter = require('./modules/reviews/review.routes');
const certificateRouter = require('./modules/certificates/certificate.routes');
const wishlistRouter = require('./modules/wishlists/wishlist.routes');
const paymentRouter = require('./modules/payments/payment.routes');
const dashboardRouter = require('./modules/dashboard/dashboard.routes');
const uploadRouter = require('./modules/uploads/upload.routes');
const errorHandler = require('./middlewares/error.middleware');
const { apiLimiter } = require('./middlewares/rateLimiter.middleware');

const app = express();
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(apiLimiter);

//Health Check Route
app.get('/health', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Server is running',
    });
});

//API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1', sectionRouter);
app.use('/api/v1', lessonRouter);
app.use('/api/v1', enrollmentRouter);
app.use('/api/v1/progress', progressRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/certificates', certificateRouter);
app.use('/api/v1/wishlists', wishlistRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/uploads', uploadRouter);

//404 Route Handler
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

//Global Error Handler
app.use(errorHandler);

module.exports = app;