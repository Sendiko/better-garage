const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Read all users
router.get('/', verifyToken, userController.getAllUsers);

// Read a single user by ID
router.get('/:id', verifyToken, userController.getUserById);

// Create a new user (Admin)
router.post('/', verifyToken, upload.single('photo'), userController.createUser);

// Update an existing user
router.put('/:id', verifyToken, upload.single('photo'), userController.updateUser);

// Delete a user
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;
