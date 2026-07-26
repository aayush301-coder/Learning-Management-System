const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../../app');

const User = require('../modules/users/user.model');
const Course = require('../modules/courses/course.model');

let mongoServer;
let instructorToken;
let studentToken;
let courseId;

beforeAll(async()=>{


    mongoServer = await MongoMemoryServer.create();


    await mongoose.connect(
        mongoServer.getUri()
    );


    const instructor = await request(app)
        .post('/api/v1/auth/register')
        .send({
            name:'Instructor',
            email:'instructor@test.com',
            password:'password123',
            confirmPassword:'password123',
            role:'instructor',
        });


    const instructorLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
            email:'instructor@test.com',
            password:'password123',
        });


    instructorToken =
        instructorLogin.body.data.token;



    await request(app)
        .post('/api/v1/auth/register')
        .send({
            name:'Student',
            email:'student@test.com',
            password:'password123',
            confirmPassword:'password123',
            role:'student',
        });


    const studentLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
            email:'student@test.com',
            password:'password123',
        });


    studentToken =
        studentLogin.body.data.token;



    const course = await request(app)
        .post('/api/v1/courses')
        .set(
            'Authorization',
            `Bearer ${instructorToken}`
        )
        .send({
            title:'Backend Development',
            description:'Complete backend course',
            category:'web_development',
            level:'beginner',
            language:'english',
            price:500,
        });


    courseId =
        course.body.data._id;


});



afterAll(async()=>{

    await User.deleteMany({});
    await Course.deleteMany({});

    await mongoose.disconnect();

    await mongoServer.stop();

});



describe('Enrollment Module',()=>{


    test('should prevent enrollment without published course',async()=>{


        const response = await request(app)
            .post(`/api/v1/enrollments/${courseId}`)
            .set(
                'Authorization',
                `Bearer ${studentToken}`
            );
        expect(response.statusCode)
            .toBe(400 || 403 || 409);
    });
});