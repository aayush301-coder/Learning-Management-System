const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
            required: true,
        },
        order: {
            type: Number,
            required: true,
        },
        videoUrl: {
            type: String,
            trim: true,
            default: null,
        },
        duration: {
            type: Number,
            default: 0,
            min: 0,
        },
        isPreview: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

lessonSchema.index({ section: 1, order: 1 }, { unique: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
