const mongoose = require('mongoose');

const { userRoles } = require('../../constants/user.constants');


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },

    role: {
        type: String,
        enum: userRoles,
        default: 'student',
    },

    avatar: {
        type: String,
        default: null,
    },

},
{
    timestamps: true,
});


module.exports = mongoose.model('User', userSchema);
