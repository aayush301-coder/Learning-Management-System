const request = require('supertest');

const app = require('../app');

const User = require('../modules/users/user.model');


describe('Auth Module', () => {

    test('should register a new user', async () => {

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'student',
            });


        expect(response.statusCode)
            .toBe(201);


        expect(response.body.success)
            .toBe(true);


        expect(response.body.data.email)
            .toBe('test@example.com');


        const user = await User.findOne({
            email: 'test@example.com',
        });


        expect(user)
            .toBeTruthy();


        expect(user.password)
            .not
            .toBe('password123');

    });



    test('should not register user with duplicate email', async () => {


        await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'First User',
                email: 'duplicate@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'student',
            });



        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Second User',
                email: 'duplicate@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'student',
            });



        expect(response.statusCode)
            .toBe(400);



        expect(response.body.success)
            .toBe(false);

    });



    test('should not register user with invalid data', async () => {


        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
                email: 'invalid@example.com',
                password: '123',
            });



        expect(response.statusCode)
            .toBe(400);



        expect(response.body.success)
            .toBe(false);

    });



    test('should login registered user', async () => {


        await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Login User',
                email: 'login@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'student',
            });



        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123',
            });



        expect(response.statusCode)
            .toBe(200);



        expect(response.body.success)
            .toBe(true);



        expect(response.body.data.accessToken)
            .toBeDefined();

    });



    test('should not login with wrong password', async () => {


        await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Wrong Password User',
                email: 'wrong@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'student',
            });



        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'wrong@example.com',
                password: 'wrongpassword',
            });



        expect(response.statusCode)
            .toBe(400);



        expect(response.body.success)
            .toBe(false);

    });



    test('should get current user with valid token', async () => {


        await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Current User',
                email: 'current@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'student',
            });



        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'current@example.com',
                password: 'password123',
            });



        const token =
            loginResponse.body.data.accessToken;



        const response = await request(app)
            .get('/api/v1/auth/me')
            .set(
                'Authorization',
                `Bearer ${token}`
            );



        expect(response.statusCode)
            .toBe(200);



        expect(response.body.data.email)
            .toBe('current@example.com');

    });



    test('should reject current user request without token', async () => {


        const response = await request(app)
            .get('/api/v1/auth/me');



        expect(response.statusCode)
            .toBe(401);



        expect(response.body.success)
            .toBe(false);
    });
});