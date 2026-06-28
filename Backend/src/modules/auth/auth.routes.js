const router = require('express').Router();
const { registerSchema, loginSchema } = require('./auth.validation');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { register, login } = require('./auth.controller');

router.post('/register', validateMiddleware(registerSchema), register);
router.post('/login', validateMiddleware(loginSchema), login);

module.exports = router;
