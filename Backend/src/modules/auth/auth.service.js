const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../users/user.model');

const SALT_ROUNDS = 10;


const generateToken = (user) => {

    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

};


const register = async (userData) => {

    const existingUser = await User.findOne({
        email: userData.email,
    });

    if (existingUser) {

        const error = new Error('An account with this email already exists');

        error.statusCode = 409;

        throw error;

    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const user = await User.create({

        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,

    });

    const safeUser = user.toObject();

    delete safeUser.password;

    return safeUser;

};


const login = async (userData) => {

    // password has `select: false` on the schema, so it must be
    // explicitly requested here for the bcrypt.compare check below.
    const user = await User.findOne({
        email: userData.email,
    }).select('+password');

    if (!user) {

        const error = new Error('Invalid email or password');

        error.statusCode = 401;

        throw error;

    }

    const isPasswordValid = await bcrypt.compare(userData.password, user.password);

    if (!isPasswordValid) {

        const error = new Error('Invalid email or password');

        error.statusCode = 401;

        throw error;

    }

    const accessToken = generateToken(user);

    const safeUser = user.toObject();

    delete safeUser.password;

    return { accessToken, user: safeUser };

};


const getCurrentUser = async (authenticatedUser) => {

    return authenticatedUser;

};


module.exports = {
    register,
    login,
    getCurrentUser,
};
