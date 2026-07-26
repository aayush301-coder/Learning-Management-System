const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const dashboardController = require('./dashboard.controller');

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    '/stats',
    authMiddleware,
    authorizeMiddleware('admin'),
    dashboardController.getStats
);

/**
 * @swagger
 * /dashboard/popular-courses:
 *   get:
 *     summary: Get popular courses
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    '/popular-courses',
    authMiddleware,
    authorizeMiddleware('admin'),
    dashboardController.getPopularCourses
);

/**
 * @swagger
 * /dashboard/revenue:
 *   get:
 *     summary: Get revenue analytics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    '/revenue',
    authMiddleware,
    authorizeMiddleware('admin'),
    dashboardController.getRevenueAnalytics
);

/**
 * @swagger
 * /dashboard/activity:
 *   get:
 *     summary: Get recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    '/activity',
    authMiddleware,
    authorizeMiddleware('admin'),
    dashboardController.getRecentActivity
);

module.exports = router;