const User = require('../users/user.model');
const Course = require('../courses/course.model');
const Enrollment = require('../enrollments/enrollment.model');
const Payment = require('../payments/payment.model');
const Review = require('../reviews/review.model');

const getStats = async () => {

    const [
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        pendingReviewCourses,
        totalEnrollments,
        revenueResult,
    ] = await Promise.all([

        User.countDocuments(),

        User.countDocuments({
            role: 'student',
        }),

        User.countDocuments({
            role: 'instructor',
        }),

        Course.countDocuments(),

        Course.countDocuments({
            status: 'published',
        }),

        Course.countDocuments({
            status: 'pending_review',
        }),

        Enrollment.countDocuments(),

        Payment.aggregate([
            {
                $match: {
                    status: 'completed',
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: '$amount',
                    },
                },
            },
        ]),
    ]);

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
            total:
                revenueResult[0]?.totalRevenue || 0,
        },
    };
};

const getPopularCourses = async () => {

    const popularCourses =
        await Enrollment.aggregate([

            {
                $group: {
                    _id: '$course',
                    totalStudents: {
                        $sum: 1,
                    },
                },
            },

            {
                $sort: {
                    totalStudents: -1,
                },
            },

            {
                $limit: 10,
            },

            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'course',
                },
            },

            {
                $unwind: '$course',
            },

            {
                $project: {
                    _id: 0,
                    courseId: '$course._id',
                    title: '$course.title',
                    thumbnail: '$course.thumbnail',
                    students:
                        '$totalStudents',
                },
            },

        ]);

    return popularCourses;
};

const getRevenueAnalytics = async () => {

    const revenue =
        await Payment.aggregate([

            {
                $match: {
                    status: 'completed',
                },
            },

            {
                $group: {

                    _id: {
                        year: {
                            $year: '$createdAt',
                        },

                        month: {
                            $month: '$createdAt',
                        },
                    },

                    revenue: {
                        $sum: '$amount',
                    },

                    transactions: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                },
            },
        ]);

    return revenue;
};

const getRecentActivity = async () => {

    const [
        recentUsers,
        recentEnrollments,
        recentPayments,
        recentReviews,
    ] = await Promise.all([

        User.find()
            .sort({
                createdAt: -1,
            })
            .limit(5)
            .select(
                'name email role createdAt'
            )
            .lean(),

        Enrollment.find()
            .sort({
                createdAt: -1,
            })
            .limit(5)
            .populate(
                'student',
                'name email'
            )
            .populate(
                'course',
                'title'
            )
            .lean(),

        Payment.find({
            status: 'completed',
        })
            .sort({
                createdAt: -1,
            })
            .limit(5)
            .populate(
                'student',
                'name email'
            )
            .populate(
                'course',
                'title'
            )
            .lean(),

        Review.find()
            .sort({
                createdAt: -1,
            })
            .limit(5)
            .populate(
                'student',
                'name email'
            )
            .populate(
                'course',
                'title'
            )
            .lean(),

    ]);

    return {
        recentUsers,
        recentEnrollments,
        recentPayments,
        recentReviews,
    };
};

module.exports = {
    getStats,
    getPopularCourses,
    getRevenueAnalytics,
    getRecentActivity,
};