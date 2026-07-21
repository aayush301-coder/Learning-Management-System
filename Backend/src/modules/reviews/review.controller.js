const asyncHandler = require('../../utils/asyncHandler');
const reviewService = require('./review.service');


const createReview = asyncHandler(async (req, res) => {
    const review = await reviewService.createReview(
        req.validated.body,
        req.user
    );

    res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: review,
    });
});


const updateReview = asyncHandler(async (req, res) => {
    const review = await reviewService.updateReview(
        {
            ...req.validated.params,
            ...req.validated.body,
        },
        req.user
    );

    res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: review,
    });
});


const deleteReview = asyncHandler(async (req, res) => {
    await reviewService.deleteReview(
        req.validated.params,
        req.user
    );

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
    });
});


const getCourseReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getCourseReviews(
        req.validated.params
    );

    res.status(200).json({
        success: true,
        message: 'Course reviews retrieved successfully',
        data: reviews,
    });
});


const getMyReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getMyReviews(
        req.user
    );

    res.status(200).json({
        success: true,
        message: 'My reviews retrieved successfully',
        data: reviews,
    });
});


module.exports = {
    createReview,
    updateReview,
    deleteReview,
    getCourseReviews,
    getMyReviews,
};