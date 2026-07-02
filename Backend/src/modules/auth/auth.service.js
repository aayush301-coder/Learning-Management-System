const User = require('../users/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (userData) => {
    if(await User.findOne({email: userData.email})) {
        const error = new Error('Email already exists');
        error.status = 400;
        throw error;
    }
    const { confirmPassword: _, ...userDataWithoutConfirmPassword } = userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userDataWithoutConfirmPassword.password, salt);

    const hashedUserData = {
        ...userDataWithoutConfirmPassword,
        password: hashedPassword,
    };

    const userDocument = await User.create(hashedUserData);
        const safeUser = userDocument.toObject();
        delete safeUser.password;
        return safeUser;
}

const login = async (userData) => {
    const userDocument = await User.findOne({email: userData.email});
    if(!userDocument) {
        const error = new Error('User not found');
        error.status = 400;
        throw error;
    }
    const passwordMatch = await bcrypt.compare(userData.password, userDocument.password);
    if(!passwordMatch) {
        const error = new Error('Incorrect Password');
        error.status = 400;
        throw error;
    }
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN,
    }
    const token = jwt.sign({id: userDocument._id}, process.env.JWT_SECRET, options);
    const safeUser = userDocument.toObject();
    delete safeUser.password;
    
    return {
        accessToken: token, 
        user: safeUser
    };
}

module.exports = {
    register,
    login,
}