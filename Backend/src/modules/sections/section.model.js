const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
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
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        order: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

sectionSchema.index({ course: 1, order: 1 }, { unique: true });

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
