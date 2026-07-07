const express = require('express');
const authRouter = require('./modules/auth/auth.routes');
const courseRouter = require('./modules/courses/course.routes');
const sectionRouter = require('./modules/sections/section.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

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