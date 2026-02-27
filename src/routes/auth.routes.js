const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// User registration endpoint
router.post('/register', authController.register);

// User login endpoint
router.post('/login', authController.login);

module.exports = router;
