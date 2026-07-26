const mongoose = require('mongoose');
const { userRoles } = require("../../constants/user.constants");

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        index:true,
        lowercase:true,
        trim:true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 6
    },
    role: {
        type: String,
        enum: {
            values: userRoles,
            message: 'User Role is not valid'
        },
        default: 'student'
    },
    avatar: {
        type: String,
        trim: true,
        default: null,
    }
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
