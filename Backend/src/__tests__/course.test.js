const request = require('supertest');

const app = require('../app');

const Course = require('../modules/courses/course.model');
const User = require('../modules/users/user.model');


let instructorToken;



beforeEach(async()=>{


    await User.deleteMany({});
    await Course.deleteMany({});



    await request(app)
        .post('/api/v1/auth/register')
        .send({

            name:"Instructor",

            email:"instructor@test.com",

            password:"password123",

            confirmPassword:"password123",

            role:"instructor"

        });



    const login =
        await request(app)
        .post('/api/v1/auth/login')
        .send({

            email:"instructor@test.com",

            password:"password123"

        });



    instructorToken =
        login.body.data.accessToken;


});




afterEach(async()=>{

    await Course.deleteMany({});

});




describe("Course Module",()=>{


test("should create course",async()=>{


    const response =
        await request(app)
        .post('/api/v1/courses')
        .set(
            'Authorization',
            `Bearer ${instructorToken}`
        )
        .send({

            title:"Complete MERN Course",

            description:"Learn MERN",

            category:"web_development",

            level:"beginner",

            language:"english",

            price:499

        });



    expect(response.statusCode)
    .toBe(201);



});




test("should get all courses",async()=>{


    await request(app)
    .post('/api/v1/courses')
    .set(
        'Authorization',
        `Bearer ${instructorToken}`
    )
    .send({

        title:"Node Course",

        description:"Backend",

        category:"web_development",

        level:"beginner",

        language:"english",

        price:299

    });



    const response =
        await request(app)
        .get('/api/v1/courses')
        .set(
            'Authorization',
            `Bearer ${instructorToken}`
        );



    expect(response.statusCode)
    .toBe(200);


});





test("should reject without token",async()=>{


    const response =
        await request(app)
        .post('/api/v1/courses')
        .send({

            title:"Test",

            description:"Test",

            category:"web_development",

            level:"beginner",

            language:"english",

            price:100

        });



    expect(response.statusCode)
    .toBe(401);


});






test("should reject invalid course",async()=>{


    const response =
        await request(app)
        .post('/api/v1/courses')
        .set(
            'Authorization',
            `Bearer ${instructorToken}`
        )
        .send({

            title:"",

            description:"",

            category:"invalid",

            level:"wrong",

            language:"english",

            price:-20

        });



    expect(response.statusCode)
    .toBe(400);


});

});