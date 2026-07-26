require('dotenv').config({
    path: '.env.test',
});

jest.setTimeout(60000);

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.mock('../config/mail', () => ({
    sendMail: jest.fn().mockResolvedValue(true),
}));

jest.mock('../config/cloudinary', () => ({
    uploader: {
        upload_stream: jest.fn(),
        destroy: jest.fn().mockResolvedValue({
            result: 'ok',
        }),
    },
}));

jest.mock('../config/razorpay', () => ({
    orders: {
        create: jest.fn(),
    },
    payments: {
        fetch: jest.fn(),
    },
}));

let mongoServer;

beforeAll(async () => {

    mongoServer = await MongoMemoryServer.create({
        instance: {
            launchTimeout: 60000,
        },
    });
    await mongoose.connect(
        mongoServer.getUri()
    );

});

afterEach(async () => {

    const collections = mongoose.connection.collections;

    for (const collection of Object.values(collections)) {
        await collection.deleteMany({});
    }

});

afterAll(async () => {

    await mongoose.connection.dropDatabase();

    await mongoose.connection.close();

    await mongoServer.stop();

});