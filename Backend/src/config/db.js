const mongoose = require('mongoose');

const logger = require('../utils/logger');


async function connectDB() {

    try {

        await mongoose.connect(process.env.DB_URI);

        logger.info('MongoDB connected');

    }
    catch (error) {

        logger.error(`Failed to connect to MongoDB: ${error.message}`);

        throw error;

    }

}


module.exports = connectDB;
