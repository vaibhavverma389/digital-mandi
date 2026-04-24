const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// this is help to register inthe system
router.post('/register', authController.registerUser);
// this is help to login in the system
router.post('/login', authController.loginUser);

module.exports = router;
