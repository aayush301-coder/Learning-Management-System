const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;


async function startServer() {

    try {

        await connectDB();

        app.listen(PORT, () => {

            logger.info(`Okla API server running on port ${PORT}`);

        });

    }
    catch (error) {

        logger.error(`Failed to start server: ${error.message}`);

        process.exit(1);

    }

}


startServer();
