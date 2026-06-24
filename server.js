const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = require('./src/app')
const connectDB = require('./src/config/db');
require('dotenv').config();

const startServer = async () => {
    try {
        await connectDB();

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    }
    catch (error) {
        console.log("Failed to start server", error.message);
        process.exit(1);
    }
}

startServer();