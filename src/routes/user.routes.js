const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Read all users
router.get('/', verifyToken, userController.getAllUsers);

// Read a single user by ID
router.get('/:id', verifyToken, userController.getUserById);

// Create a new user (Admin)
router.post('/', verifyToken, userController.createUser);

// Update an existing user
router.put('/:id', verifyToken, userController.updateUser);

// Delete a user
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;
