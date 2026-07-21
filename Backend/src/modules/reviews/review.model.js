const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            index: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        review: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

reviewSchema.index(
    {
        student: 1,
        course: 1,
    },
    {
        unique: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;