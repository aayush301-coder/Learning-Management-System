const request = require('supertest');

const app = require('../app');

const User = require('../modules/users/user.model');
const Course = require('../modules/courses/course.model');
const Enrollment = require('../modules/enrollments/enrollment.model');


let studentToken;
let courseId;



const createUser = async (role, email) => {


    await request(app)
        .post('/api/v1/auth/register')
        .send({

            name:
                role === 'student'
                    ? 'Student User'
                    : 'Instructor User',

            email,

            password:
                'password123',

            confirmPassword:
                'password123',

            role,

        });



    const login =
        await request(app)
            .post('/api/v1/auth/login')
            .send({

                email,

                password:
                    'password123',

            });



    return login.body.data.accessToken;

};






const createPublishedCourse = async () => {


    const instructorToken =
        await createUser(
            'instructor',
            `instructor_${Date.now()}@test.com`
        );



    const response =
        await request(app)
            .post('/api/v1/courses')
            .set(
                'Authorization',
                `Bearer ${instructorToken}`
            )
            .send({

                title:
                    'MERN Course',

                description:
                    'Complete MERN Course',

                category:
                    'web_development',

                level:
                    'beginner',

                language:
                    'english',

                price:
                    499,

            });



    const course =
        response.body.data;



    await Course.findByIdAndUpdate(
        course._id,
        {
            status:'published'
        }
    );



    return course._id;

};






beforeEach(async()=>{


    const unique =
        Date.now();



    studentToken =
        await createUser(
            'student',
            `student_${unique}@test.com`
        );



    courseId =
        await createPublishedCourse();



});






afterEach(async()=>{


    await Enrollment.deleteMany({});

    await Course.deleteMany({});

    await User.deleteMany({});


});







describe('Enrollment Module',()=>{



    test('should enroll student into course', async()=>{


        const response =
            await request(app)
                .post(
                    `/api/v1/courses/${courseId}/enroll`
                )
                .set(
                    'Authorization',
                    `Bearer ${studentToken}`
                );



        expect(response.statusCode)
            .toBe(201);



        expect(response.body.success)
            .toBe(true);



        const enrollment =
            await Enrollment.findOne({
                course:courseId
            });



        expect(enrollment)
            .toBeTruthy();


    });







    test('should get my enrollments', async()=>{


        await request(app)
            .post(
                `/api/v1/courses/${courseId}/enroll`
            )
            .set(
                'Authorization',
                `Bearer ${studentToken}`
            );



        const response =
            await request(app)
                .get('/api/v1/enrollments/me')
                .set(
                    'Authorization',
                    `Bearer ${studentToken}`
                );



        expect(response.statusCode)
            .toBe(200);



        expect(response.body.success)
            .toBe(true);



        expect(response.body.data)
            .toHaveLength(1);


    });








    test('should not enroll twice', async()=>{


        await request(app)
            .post(
                `/api/v1/courses/${courseId}/enroll`
            )
            .set(
                'Authorization',
                `Bearer ${studentToken}`
            );



        const response =
            await request(app)
                .post(
                    `/api/v1/courses/${courseId}/enroll`
                )
                .set(
                    'Authorization',
                    `Bearer ${studentToken}`
                );



        expect(response.statusCode)
            .toBe(409);



        expect(response.body.success)
            .toBe(false);


    });








    test('should cancel enrollment', async()=>{


        await request(app)
            .post(
                `/api/v1/courses/${courseId}/enroll`
            )
            .set(
                'Authorization',
                `Bearer ${studentToken}`
            );



        const response =
            await request(app)
                .delete(
                    `/api/v1/courses/${courseId}/enroll`
                )
                .set(
                    'Authorization',
                    `Bearer ${studentToken}`
                );



        expect(response.statusCode)
            .toBe(200);



        const enrollment =
            await Enrollment.findOne({
                course:courseId
            });



        expect(enrollment)
            .toBeNull();


    });








    test('should reject enrollment without authentication', async()=>{


        const response =
            await request(app)
                .post(
                    `/api/v1/courses/${courseId}/enroll`
                );



        expect(response.statusCode)
            .toBe(401);



        expect(response.body.success)
            .toBe(false);
    });
});