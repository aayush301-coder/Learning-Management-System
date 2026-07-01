const router = require('express').Router();
const { registerSchema, loginSchema } = require('./auth.validation');
const validateMiddleware = require('../../middlewares/validate.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const { register, login, getCurrentUser } = require('./auth.controller');
router.post('/register', validateMiddleware(registerSchema), register);
router.post('/login', validateMiddleware(loginSchema), login);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
