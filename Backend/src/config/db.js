const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB connected');
    }
    catch (error) {
        console.log("Failed to connect to MongoDB", error.message);
        throw error;
    }
}

module.exports = connectDB;