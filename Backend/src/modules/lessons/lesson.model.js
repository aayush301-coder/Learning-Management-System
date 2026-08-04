const mongoose = require('mongoose');


const lessonSchema = new mongoose.Schema({

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

    videoUrl: {
        type: String,
        trim: true,
        default: null,
    },

    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
        index: true,
    },

    duration: {
        type: Number,
        default: 0,
    },

    order: {
        type: Number,
        default: 0,
    },

    isPreview: {
        type: Boolean,
        default: false,
    },

},
{
    timestamps: true,
});


module.exports = mongoose.model('Lesson', lessonSchema);
