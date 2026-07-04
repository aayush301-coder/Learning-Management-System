const router = require('express').Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeMiddleware = require('../../middlewares/authorize.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } = require('./course.controller');
const { createCourseSchema, updateCourseSchema, getAllCoursesSchema } = require('./course.validation');

// Create a new course
router.post('/', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(createCourseSchema),createCourse);

// Get all courses
router.get('/', authMiddleware, authorizeMiddleware('student', 'instructor', 'admin'), validateMiddleware(getAllCoursesSchema, 'query'), getAllCourses);
/*
// Get a course by ID
router.get('/:courseId', authMiddleware, authorizeMiddleware('student', 'instructor', 'admin'), getCourseById);

// Update a course
router.patch('/:courseId', authMiddleware, authorizeMiddleware('instructor', 'admin'), validateMiddleware(updateCourseSchema), updateCourse);

// Delete a course
router.delete('/:courseId', authMiddleware, authorizeMiddleware('instructor', 'admin'), deleteCourse);
*/
module.exports = router;