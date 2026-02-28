const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Read all users
router.get('/', verifyToken, userController.getAllUsers);

// Read a single user by ID
router.get('/:id', verifyToken, userController.getUserById);

// Create a new user (System Admin or general user creation)
router.post('/', verifyToken, upload.single('photo'), userController.createUser);

// Create a new technician specifically for the admin's garage
router.post('/technician', verifyToken, requireRole(['Admin']), upload.single('photo'), userController.createTechnician);

// Update an existing user
router.put('/:id', verifyToken, upload.single('photo'), userController.updateUser);

// Delete a user
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;
