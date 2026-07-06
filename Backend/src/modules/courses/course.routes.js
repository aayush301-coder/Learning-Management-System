const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { createCourse, getAllCourses, getMyCourses, getCourseById, updateCourse, deleteCourse, submitCourseForReview, publishCourse, unpublishCourse, archiveCourse, restoreArchivedCourse } = require('./course.controller');
const { createCourseSchema, updateCourseSchema, getAllCoursesSchema, getMyCoursesSchema, getCourseByIdSchema, submitCourseForReviewSchema, publishCourseSchema, unpublishCourseSchema, archiveCourseSchema, restoreArchivedCourseSchema } = require('./course.validation');

// Create a new course
router.post('/', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(createCourseSchema),createCourse);

// Get all courses
router.get('/', authMiddleware, authorizeMiddleware('student', 'instructor', 'admin'), validateMiddleware(getAllCoursesSchema, 'query'), getAllCourses);

// Get my courses
router.get('/my',authMiddleware,authorizeMiddleware('instructor'),validateMiddleware(getMyCoursesSchema, 'query'),
getMyCourses);

// Get a course by ID
router.get('/:courseId', authMiddleware, authorizeMiddleware('student', 'instructor', 'admin'), validateMiddleware(getCourseByIdSchema, 'params'), getCourseById);

// Update a course
router.patch('/:courseId', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(getCourseByIdSchema, 'params'), validateMiddleware(updateCourseSchema), updateCourse);

// Delete a course
router.delete('/:courseId', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(getCourseByIdSchema, 'params'), deleteCourse);

// Submit a course for review
router.patch('/:courseId/submit-review', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(submitCourseForReviewSchema, 'params'), submitCourseForReview);

// Publish a course
router.patch('/:courseId/publish', authMiddleware, authorizeMiddleware('admin'), validateMiddleware(publishCourseSchema, 'params'), publishCourse);

// Unpublish a course
router.patch('/:courseId/unpublish', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(unpublishCourseSchema, 'params'), unpublishCourse);

// Archive a course
router.patch('/:courseId/archive', authMiddleware, authorizeMiddleware('admin'), validateMiddleware(archiveCourseSchema, 'params'), archiveCourse);

// Restore an archived course
router.patch('/:courseId/restore', authMiddleware, authorizeMiddleware('admin'), validateMiddleware(restoreArchivedCourseSchema, 'params'), restoreArchivedCourse);

module.exports = router;