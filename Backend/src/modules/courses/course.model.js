const mongoose = require('mongoose');
const { courseCategories, courseLevels, courseLanguages, courseStatus } = require("../../constants/course.constants");

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        minlength: [5, 'Course title must be at least 5 characters long'],
        maxlength: [150, 'Course title cannot exceed 150 characters'],
    },

    slug: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        index: true,
    },

    description: {
        type: String,
        required: [true, 'Course description is required'],
        trim: true,
        minlength: [10, 'Course description must be at least 10 characters long'],
        maxlength: [5000, 'Course description cannot exceed 5000 characters'],
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Course instructor is required'],
        index: true,
    },

    thumbnail: {
        type: String,
        default: null,
        trim: true,
    },

    category: {
        type: String,
        required: [true, 'Course category is required'],
        enum: {
            values: courseCategories,
            message: 'Course category is not valid'
        }
    },

    level: {
        type: String,
        required: [true, 'Course level is required'],
        enum: {
            values: courseLevels,
            message: 'Course level is not valid'
        },
    },

    language: {
        type: String,
        required: [true, 'Course language is required'],
        trim: true,
        enum: {
            values: courseLanguages,
            message: 'Course language is not valid'
        },
    },

    price: {
        type: Number,
        required: [true, 'Course price is required'],
        min: [0, 'Course price cannot be negative'],
        default: 0,
    },

    status: {
        type: String,
        required: [true, 'Course status is required'],
        default: 'draft',
        enum: {
            values: courseStatus,
            message: 'Course status is not valid'
        },
    },

    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    reviewCount: {
        type: Number,
        default: 0,
        min: 0,
    },

},
{
    timestamps: true,
});


courseSchema.index({
    instructor: 1,
    status: 1,
});


const Course = mongoose.model('Course', courseSchema);

module.exports = Course;