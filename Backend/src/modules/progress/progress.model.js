const mongoose = require('mongoose');


const progressSchema = new mongoose.Schema({

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

    completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    }],

    lastAccessedLesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        default: null,
    },

    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },

    completionStatus: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started',
    },

},
{
    timestamps: true,
});


progressSchema.index({ student: 1, course: 1 }, { unique: true });


module.exports = mongoose.model('Progress', progressSchema);
