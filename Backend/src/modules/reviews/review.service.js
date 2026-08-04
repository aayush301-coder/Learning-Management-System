const Review = require('./review.model');
const Course = require('../courses/course.model');
const Enrollment = require('../enrollments/enrollment.model');


const recalculateCourseRating = async (courseId) => {

    const stats = await Review.aggregate([

        { $match: { course: courseId } },

        {
            $group: {
                _id: '$course',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
            },
        },

    ]);

    const ratingAverage = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
    const ratingCount = stats.length > 0 ? stats[0].totalReviews : 0;

    await Course.findByIdAndUpdate(courseId, { ratingAverage, ratingCount });

};


const getReviewsByCourse = async (validatedParams) => {

    const reviews = await Review.find({ course: validatedParams.courseId })
        .populate('student', 'name avatar')
        .sort({ createdAt: -1 });

    return reviews;

};


const createReview = async (validatedParams, validatedBody, authenticatedUser) => {

    const course = await Course.findById(validatedParams.courseId);

    if (!course) {

        const error = new Error('Course not found');

        error.statusCode = 404;

        throw error;

    }

    const isEnrolled = await Enrollment.findOne({
        student: authenticatedUser._id,
        course: course._id,
        status: 'active',
    });

    if (!isEnrolled) {

        const error = new Error('You must be enrolled in this course to leave a review');

        error.statusCode = 403;

        throw error;

    }

    const existingReview = await Review.findOne({
        student: authenticatedUser._id,
        course: course._id,
    });

    if (existingReview) {

        const error = new Error('You have already reviewed this course. Please edit your existing review instead.');

        error.statusCode = 409;

        throw error;

    }

    const review = await Review.create({

        ...validatedBody,
        student: authenticatedUser._id,
        course: course._id,

    });

    await recalculateCourseRating(course._id);

    return review;

};


const findReviewOrThrow = async (reviewId) => {

    const review = await Review.findById(reviewId);

    if (!review) {

        const error = new Error('Review not found');

        error.statusCode = 404;

        throw error;

    }

    return review;

};


const updateReview = async (validatedParams, validatedBody, authenticatedUser) => {

    const review = await findReviewOrThrow(validatedParams.reviewId);

    if (review.student.toString() !== authenticatedUser._id.toString()) {

        const error = new Error('You are not authorized to edit this review');

        error.statusCode = 403;

        throw error;

    }

    Object.assign(review, validatedBody);

    await review.save();

    await recalculateCourseRating(review.course);

    return review;

};


const deleteReview = async (validatedParams, authenticatedUser) => {

    const review = await findReviewOrThrow(validatedParams.reviewId);

    const isOwner = review.student.toString() === authenticatedUser._id.toString();
    const isAdmin = authenticatedUser.role === 'admin';

    if (!isOwner && !isAdmin) {

        const error = new Error('You are not authorized to delete this review');

        error.statusCode = 403;

        throw error;

    }

    const { course } = review;

    await review.deleteOne();

    await recalculateCourseRating(course);

    return { reviewId: validatedParams.reviewId };

};


module.exports = {
    getReviewsByCourse,
    createReview,
    updateReview,
    deleteReview,
};
