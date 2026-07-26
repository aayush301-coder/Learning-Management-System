const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'Learning Management System API',
            version: '1.0.0',
            description:
                'API documentation for MERN Learning Management System',

            contact: {
                name: 'LMS Backend Team',
            },
        },

        servers: [
            {
                url: 'http://localhost:5000/api/v1',
                description: 'Local server',
            },

            {
                url: 'https://your-production-domain.com/api/v1',
                description: 'Production server',
            },
        ],

        components: {

            securitySchemes: {

                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },

            },

        },

    },

    apis: [
        './src/modules/**/*.routes.js',
    ],
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);


module.exports = swaggerSpec;