const userModel = require('../users/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (userData) => {
    if(await userModel.findOne({email: userData.email})) {
        const error = new Error('Email already exists');
        error.status = 400;
        throw error;
    }
    const userPassword = userData.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);
    const hashedUserData = {
        ...userData,
        password: hashedPassword,
    };
    
    const user = await userModel.create(hashedUserData);
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

const login = async (userData) => {
    const user = await userModel.findOne({email: userData.email});
    if(!user) {
        const error = new Error('User not found');
        error.status = 400;
        throw error;
    }
    const passwordMatch = await bcrypt.compare(userData.password, user.password);
    if(!passwordMatch) {
        const error = new Error('Incorrect Password');
        error.status = 400;
        throw error;
    }
    const options = {
        expiresIn: '1h',
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, options);

    const userObject = user.toObject();
    delete userObject.password;
    return {token, userObject};
}

module.exports = {
    register,
    login,
}