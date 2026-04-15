const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload = require('../middlewares/upload.middleware');

// User registration endpoint
router.post('/register', upload.single('photo'), authController.register);

// Garage Owner registration endpoint
router.post('/register-owner', upload.single('photo'), authController.registerOwner);

// User login endpoint
router.post('/login', upload.none(), authController.login);

// Refresh token endpoint
router.post('/refresh', upload.none(), authController.refreshToken);

module.exports = router;
