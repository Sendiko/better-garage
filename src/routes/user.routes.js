const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Read all users
router.get('/', userController.getAllUsers);

// Read a single user by ID
router.get('/:id', userController.getUserById);

// Create a new user (Admin)
router.post('/', userController.createUser);

// Update an existing user
router.put('/:id', userController.updateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;
