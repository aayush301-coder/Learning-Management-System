require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');

let server;

const startServer = async () => {
    try {
        await connectDB();

        server = app.listen(process.env.PORT, () => {
            logger.info(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        logger.error({
            message: 'Failed to start server',
            error: error.message,
            stack: error.stack,
        });

        process.exit(1);
    }
};

const shutdownServer = (signal) => {

    logger.info(`${signal} received. Shutting down server...`);

    if(server) {
        server.close(() => {
            logger.info('HTTP server closed');
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
};

process.on('uncaughtException', (error) => {

    logger.error({
        message: 'Uncaught Exception',
        error: error.message,
        stack: error.stack,
    });

    process.exit(1);
});

process.on('unhandledRejection', (error) => {

    logger.error({
        message: 'Unhandled Promise Rejection',
        error: error.message,
        stack: error.stack,
    });

    shutdownServer('Unhandled Rejection');
});

process.on('SIGTERM', () => {
    shutdownServer('SIGTERM');
});

process.on('SIGINT', () => {
    shutdownServer('SIGINT');
});

startServer();