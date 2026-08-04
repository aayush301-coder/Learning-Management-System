const asyncHandler = require('../../utils/asyncHandler');

const reviewService = require('./review.service');


const getReviewsByCourse = asyncHandler(async (req, res) => {

    const reviews = await reviewService.getReviewsByCourse(req.validated.params);

    res.status(200).json({

        success: true,
        message: 'Reviews retrieved successfully',
        data: reviews,

    });

});


const createReview = asyncHandler(async (req, res) => {

    const review = await reviewService.createReview(req.validated.params, req.validated.body, req.user);

    res.status(201).json({

        success: true,
        message: 'Review submitted successfully',
        data: review,

    });

});


const updateReview = asyncHandler(async (req, res) => {

    const review = await reviewService.updateReview(req.validated.params, req.validated.body, req.user);

    res.status(200).json({

        success: true,
        message: 'Review updated successfully',
        data: review,

    });

});


const deleteReview = asyncHandler(async (req, res) => {

    const result = await reviewService.deleteReview(req.validated.params, req.user);

    res.status(200).json({

        success: true,
        message: 'Review deleted successfully',
        data: result,

    });

});


module.exports = {
    getReviewsByCourse,
    createReview,
    updateReview,
    deleteReview,
};
