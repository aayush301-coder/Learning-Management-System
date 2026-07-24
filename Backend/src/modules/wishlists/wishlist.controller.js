const asyncHandler = require('../../utils/asyncHandler');
const wishlistService = require('./wishlist.service');


const addToWishlist = asyncHandler(async (req, res) => {

    const wishlist = await wishlistService.addToWishlist(
        req.validated.params,
        req.user
    );


    res.status(201).json({
        success: true,
        message: 'Course added to wishlist successfully',
        data: wishlist,
    });
});



const removeFromWishlist = asyncHandler(async (req, res) => {

    await wishlistService.removeFromWishlist(
        req.validated.params,
        req.user
    );


    res.status(200).json({
        success: true,
        message: 'Course removed from wishlist successfully',
    });
});



const getMyWishlist = asyncHandler(async (req, res) => {

    const wishlist = await wishlistService.getMyWishlist(
        req.user
    );


    res.status(200).json({
        success: true,
        message: 'My wishlist retrieved successfully',
        data: wishlist,
    });
});



module.exports = {
    addToWishlist,
    removeFromWishlist,
    getMyWishlist,
};