const mongoose = require('mongoose');

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
            values: ['web_development','mobile_development','data_science','artificial_intelligence','machine_learning','cyber_security','cloud_computing','devops','programming_languages','database','ui_ux_design', 'business','marketing','productivity'],
            message: 'Course category is not valid'
        }
    },
    level: {
        type: String,
        required: [true, 'Course level is required'],
        enum: {
            values: ['beginner','intermediate','advanced'],
            message: 'Course level is not valid'
        },
    },
    language: {
        type: String,
        required: [true, 'Course language is required'],
        trim: true,
        enum: {
            values: ['english','hindi','spanish','french'],
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
            values: ['draft','pending_review', 'published', 'unpublished', 'archived'],
            message: 'Course status is not valid'
        },
    },
},
{
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
