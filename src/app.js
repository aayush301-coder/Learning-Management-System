const express = require('express');
const multer = require('multer');

const app = express();

app.use(express.json());
const upload = multer();

//test route
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
})

module.exports = app;