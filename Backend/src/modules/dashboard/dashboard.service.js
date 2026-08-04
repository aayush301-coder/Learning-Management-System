const User = require('../users/user.model');
const Course = require('../courses/course.model');
const Enrollment = require('../enrollments/enrollment.model');


const getDashboardStats = async () => {

    const [totalUsers, totalStudents, totalInstructors] = await Promise.all([

        User.countDocuments(),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'instructor' }),

    ]);

    const [totalCourses, publishedCourses, pendingReviewCourses] = await Promise.all([

        Course.countDocuments(),
        Course.countDocuments({ status: 'published' }),
        Course.countDocuments({ status: 'pending_review' }),

    ]);

    const totalEnrollments = await Enrollment.countDocuments({ status: 'active' });

    const revenueResult = await Enrollment.aggregate([

        { $match: { status: 'active' } },

        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },

        { $unwind: '$course' },

        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$course.price' },
            },
        },

    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return {

        users: {
            total: totalUsers,
            students: totalStudents,
            instructors: totalInstructors,
        },

        courses: {
            total: totalCourses,
            published: publishedCourses,
            pendingReview: pendingReviewCourses,
        },

        enrollments: {
            total: totalEnrollments,
        },

        revenue: {
            total: totalRevenue,
        },

    };

};


const getPopularCourses = async () => {

    const popular = await Enrollment.aggregate([

        { $match: { status: 'active' } },

        {
            $group: {
                _id: '$course',
                enrollmentCount: { $sum: 1 },
            },
        },

        { $sort: { enrollmentCount: -1 } },

        { $limit: 5 },

        {
            $lookup: {
                from: 'courses',
                localField: '_id',
                foreignField: '_id',
                as: 'course',
            },
        },

        { $unwind: '$course' },

        {
            $project: {
                _id: 0,
                course: '$course',
                enrollmentCount: 1,
            },
        },

    ]);

    return popular;

};


const getRecentActivity = async () => {

    const recentEnrollments = await Enrollment.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('student', 'name email')
        .populate('course', 'title');

    return recentEnrollments;

};


module.exports = {
    getDashboardStats,
    getPopularCourses,
    getRecentActivity,
};
