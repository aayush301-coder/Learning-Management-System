const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const dashboardController = require('./dashboard.controller');

// Dashboard statistics
router.get(
    '/stats',
    authMiddleware,
    authorizeMiddleware('admin'),
    dashboardController.getStats
);

// Popular courses
router.get(
    '/popular-courses',
    authMiddleware,
    authorizeMiddleware('admin'),
    dashboardController.getPopularCourses
);

// Revenue analytics
router.get(
    '/revenue',
    authMiddleware,
    authorizeMiddleware('admin'),
    dashboardController.getRevenueAnalytics
);

// Recent activity
router.get(
    '/activity',
    authMiddleware,
    authorizeMiddleware('admin'),
    dashboardController.getRecentActivity
);

module.exports = router;