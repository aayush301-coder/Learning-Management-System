const mongoose = require('mongoose');


const enrollmentSchema = new mongoose.Schema({

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

    status: {
        type: String,
        enum: ['active', 'cancelled'],
        default: 'active',
    },

},
{
    timestamps: true,
});


// A student can only have one enrollment record per course.
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });


module.exports = mongoose.model('Enrollment', enrollmentSchema);
