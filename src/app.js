const express = require('express');
const authRouter = require('./modules/auth/auth.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use(errorHandler);

module.exports = app;