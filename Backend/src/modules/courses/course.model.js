const mongoose = require('mongoose');

const {
    courseCategories,
    courseLevels,
    courseLanguages,
    courseStatuses,
} = require('../../constants/course.constants');


const courseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    thumbnail: {
        type: String,
        default: null,
    },

    category: {
        type: String,
        enum: courseCategories,
        required: true,
    },

    level: {
        type: String,
        enum: courseLevels,
        required: true,
    },

    language: {
        type: String,
        enum: courseLanguages,
        default: 'english',
    },

    price: {
        type: Number,
        default: 0,
        min: 0,
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },

    status: {
        type: String,
        enum: courseStatuses,
        default: 'draft',
        index: true,
    },

    ratingAverage: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    ratingCount: {
        type: Number,
        default: 0,
    },

},
{
    timestamps: true,
});


courseSchema.index({ title: 'text', description: 'text' });


module.exports = mongoose.model('Course', courseSchema);
