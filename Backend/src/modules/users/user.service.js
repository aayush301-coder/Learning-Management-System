const User = require('./user.model');


const getAllUsers = async (validatedQuery) => {

    const { page, limit, search, role } = validatedQuery;

    const skip = (page - 1) * limit;

    const filter = {};

    if (role) {

        filter.role = role;

    }

    if (search) {

        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];

    }

    const totalDocuments = await User.countDocuments(filter);

    const users = await User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalPages = totalDocuments > 0 ? Math.ceil(totalDocuments / limit) : 0;

    return {

        users,

        pagination: {
            currentPage: page,
            pageSize: limit,
            totalDocuments,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },

    };

};


const updateOwnProfile = async (validatedBody, authenticatedUser) => {

    const user = await User.findById(authenticatedUser._id);

    if (!user) {

        const error = new Error('User not found');

        error.statusCode = 404;

        throw error;

    }

    if (validatedBody.name !== undefined) {

        user.name = validatedBody.name;

    }

    if (validatedBody.avatar !== undefined) {

        user.avatar = validatedBody.avatar;

    }

    await user.save();

    return user;

};


module.exports = {
    getAllUsers,
    updateOwnProfile,
};
