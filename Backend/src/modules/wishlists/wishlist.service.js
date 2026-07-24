const Wishlist = require('./wishlist.model');
const Course = require('../courses/course.model');


const addToWishlist = async (validatedParams, authenticatedUser) => {

    const {
        courseId,
    } = validatedParams;
    const studentId = authenticatedUser._id;
    const course = await Course.findOne({
        _id: courseId,
        status: 'published',
    });

    if (!course) {
        const error = new Error('Course not found or not available');
        error.statusCode = 404;
        throw error;
    }

    const existingWishlist = await Wishlist.findOne({
        student: studentId,
        course: courseId,
    });

    if (existingWishlist) {
        const error = new Error('Course already exists in wishlist');
        error.statusCode = 409;
        throw error;
    }

    const wishlist = await Wishlist.create({
        student: studentId,
        course: courseId,
    });

    return wishlist;
};



const removeFromWishlist = async (validatedParams, authenticatedUser) => {

    const {
        courseId,
    } = validatedParams;
    const studentId = authenticatedUser._id;
    const wishlist = await Wishlist.findOneAndDelete({
        student: studentId,
        course: courseId,
    });

    if (!wishlist) {
        const error = new Error('Course not found in wishlist');
        error.statusCode = 404;
        throw error;
    }

    return;
};



const getMyWishlist = async (authenticatedUser) => {

    const studentId = authenticatedUser._id;


    const wishlist = await Wishlist.find({
        student: studentId,
    })
        .populate(
            'course',
            'title thumbnail category level price instructor status'
        )
        .sort({
            createdAt: -1,
        });


    return wishlist;
};



module.exports = {
    addToWishlist,
    removeFromWishlist,
    getMyWishlist,
};