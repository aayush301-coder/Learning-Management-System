const userModel = require('../users/user.model');
const bcrypt = require('bcrypt');

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

const login = async () => {

}

module.exports = {
    register,
    login,
}