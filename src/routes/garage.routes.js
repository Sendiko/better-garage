const express = require('express');
const router = express.Router();
const garageController = require('../controllers/garage.controller');

const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// Define allowed roles
const allRoles = ['Admin', 'Technician', 'Customer'];

// Read all garages (all roles)
router.get('/', verifyToken, requireRole(allRoles), garageController.getAllGarages);

// Read a single garage by ID (all roles)
router.get('/:id', verifyToken, requireRole(allRoles), garageController.getGarageById);

// Create a new garage (Admin)
router.post('/', verifyToken, requireRole(['Admin']), garageController.createGarage);

// Update an existing garage (Admin)
router.put('/:id', verifyToken, requireRole(['Admin']), garageController.updateGarage);

// Delete a garage (Admin)
router.delete('/:id', verifyToken, requireRole(['Admin']), garageController.deleteGarage);

module.exports = router;
