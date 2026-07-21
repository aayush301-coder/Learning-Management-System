const mongoose = require('mongoose');
const Review = require('./review.model');
const Course = require('../courses/course.model');
const Enrollment = require('../enrollments/enrollment.model');


const updateCourseRating = async (courseId) => {

    const result = await Review.aggregate([
        {
            $match: {
                course: new mongoose.Types.ObjectId(courseId),
            },
        },
        {
            $group: {
                _id: '$course',
                averageRating: {
                    $avg: '$rating',
                },
                reviewCount: {
                    $sum: 1,
                },
            },
        },
    ]);


    if (result.length === 0) {
        await Course.findByIdAndUpdate(courseId, {
            averageRating: 0,
            reviewCount: 0,
        });

        return;
    }


    await Course.findByIdAndUpdate(courseId, {
        averageRating: Number(result[0].averageRating.toFixed(1)),
        reviewCount: result[0].reviewCount,
    });
};


const createReview = async (validatedData, authenticatedUser) => {
    const {
        courseId,
        rating,
        review,
    } = validatedData;

    const studentId = authenticatedUser._id;


    const course = await Course.findById(courseId);

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
    }


    const enrolled = await Enrollment.findOne({
        student: studentId,
        course: courseId,
    });

    if (!enrolled) {
        const error = new Error('You must be enrolled to review this course');
        error.statusCode = 403;
        throw error;
    }


    const existingReview = await Review.findOne({
        student: studentId,
        course: courseId,
    });

    if (existingReview) {
        const error = new Error('You have already reviewed this course');
        error.statusCode = 409;
        throw error;
    }


    const createdReview = await Review.create({
        student: studentId,
        course: courseId,
        rating,
        review,
    });


    await updateCourseRating(courseId);

    return createdReview;
};


const updateReview = async (validatedData, authenticatedUser) => {
    const {
        reviewId,
        rating,
        review,
    } = validatedData;

    const studentId = authenticatedUser._id;


    const existingReview = await Review.findById(reviewId);

    if (!existingReview) {
        const error = new Error('Review not found');
        error.statusCode = 404;
        throw error;
    }


    if (existingReview.student.toString() !== studentId.toString()) {
        const error = new Error('You are not allowed to update this review');
        error.statusCode = 403;
        throw error;
    }


    if (rating !== undefined) {
        existingReview.rating = rating;
    }

    if (review !== undefined) {
        existingReview.review = review;
    }


    await existingReview.save();

    await updateCourseRating(existingReview.course);

    return existingReview;
};


const deleteReview = async (validatedParams, authenticatedUser) => {
    const {
        reviewId,
    } = validatedParams;

    const studentId = authenticatedUser._id;


    const existingReview = await Review.findById(reviewId);

    if (!existingReview) {
        const error = new Error('Review not found');
        error.statusCode = 404;
        throw error;
    }


    if (existingReview.student.toString() !== studentId.toString()) {
        const error = new Error('You are not allowed to delete this review');
        error.statusCode = 403;
        throw error;
    }


    const courseId = existingReview.course;

    await Review.findByIdAndDelete(reviewId);

    await updateCourseRating(courseId);

    return;
};


const getCourseReviews = async (validatedParams) => {
    const {
        courseId,
    } = validatedParams;


    const reviews = await Review.find({
        course: courseId,
    })
        .populate('student', 'name avatar')
        .sort({
            createdAt: -1,
        });


    return reviews;
};


const getMyReviews = async (authenticatedUser) => {
    const studentId = authenticatedUser._id;

    const reviews = await Review.find({
        student: studentId,
    })
        .populate('course')
        .sort({
            createdAt: -1,
        });


    return reviews;
};


module.exports = {
    createReview,
    updateReview,
    deleteReview,
    getCourseReviews,
    getMyReviews,
};