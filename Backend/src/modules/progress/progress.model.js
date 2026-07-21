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
    completedLessons: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson',
        }],
        default: [],
    },
    lastAccessedLesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        default: null,
    },
    completionPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    completionStatus: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started',
    },
    completedAt: {
        type: mongoose.Schema.Types.Date,
        default: null,
    },
},
{
    timestamps: true,
}
);

progressSchema.index (
    {student: 1, course: 1},
    {unique: true},
);

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
