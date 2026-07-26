const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../../app');

const User = require('../modules/users/user.model');
const Course = require('../modules/courses/course.model');

let mongoServer;
let instructorToken;

beforeAll(async () => {

    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(
        mongoServer.getUri()
    );


    await request(app)
        .post('/api/v1/auth/register')
        .send({
            name:'Instructor',
            email:'instructor@test.com',
            password:'password123',
            confirmPassword:'password123',
            role:'instructor',
        });


    const login = await request(app)
        .post('/api/v1/auth/login')
        .send({
            email:'instructor@test.com',
            password:'password123',
        });


    instructorToken = login.body.data.token;

});

afterEach(async()=>{
    await Course.deleteMany({});
});


afterAll(async()=>{

    await User.deleteMany({});

    await mongoose.disconnect();

    await mongoServer.stop();

});



describe('Course Module',()=>{


    test('should create course',async()=>{


        const response = await request(app)
            .post('/api/v1/courses')
            .set(
                'Authorization',
                `Bearer ${instructorToken}`
            )
            .send({
                title:'Complete MERN Development Course',
                description:'Learn MERN stack from beginner to advanced',
                category:'web_development',
                level:'beginner',
                language:'english',
                price:499,
            });


        expect(response.statusCode)
            .toBe(201);


        expect(response.body.data.title)
            .toBe(
                'Complete MERN Development Course'
            );

    });



    test('should get courses',async()=>{


        const response = await request(app)
            .get('/api/v1/courses')
            .set(
                'Authorization',
                `Bearer ${instructorToken}`
            );


        expect(response.statusCode)
            .toBe(200);


        expect(
            response.body.data.courses
        )
            .toBeDefined();
    });
});