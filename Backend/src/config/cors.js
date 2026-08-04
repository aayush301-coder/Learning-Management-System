// Falls back to the local Vite dev server when CLIENT_URL isn't set,
// instead of silently degrading to a wildcard origin.
const corsOptions = {

    origin: process.env.CLIENT_URL || 'http://localhost:5173',

    credentials: true,

    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],

};


module.exports = corsOptions;
