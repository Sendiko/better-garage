const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload = require('../middlewares/upload.middleware');

// User registration endpoint
router.post('/register', upload.single('photo'), authController.register);

// User login endpoint
router.post('/login', authController.login);

module.exports = router;
