const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');

const {
    getDashboardStats,
    getPopularCourses,
    getRecentActivity,
} = require('./dashboard.controller');


router.get(
    '/stats',
    authMiddleware,
    authorizeMiddleware('admin'),
    getDashboardStats
);


router.get(
    '/popular-courses',
    authMiddleware,
    authorizeMiddleware('admin'),
    getPopularCourses
);


router.get(
    '/activity',
    authMiddleware,
    authorizeMiddleware('admin'),
    getRecentActivity
);


module.exports = router;
