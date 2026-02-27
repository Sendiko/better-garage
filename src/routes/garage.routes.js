const express = require('express');
const router = express.Router();
const garageController = require('../controllers/garage.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { Role } = require('../database/models');

// Fetch allowed roles dynamically from the database
const allRoles = [];
Role.findAll()
    .then(roles => {
        allRoles.push(...roles.map(r => r.name));
    })
    .catch(err => console.error('Failed to fetch roles for garage endpoints:', err));

// Read all garages (all roles)
router.get('/', verifyToken, requireRole(allRoles), garageController.getAllGarages);

// Read admin's garage (Admin)
router.get('/my-garage', verifyToken, requireRole(['Admin']), garageController.getGarage);

// Read a single garage by ID (all roles)
router.get('/:id', verifyToken, requireRole(allRoles), garageController.getGarageById);

// Create a new garage (Admin)
router.post('/', verifyToken, requireRole(['Admin']), garageController.createGarage);

// Update an existing garage (Admin)
router.put('/:id', verifyToken, requireRole(['Admin']), garageController.updateGarage);

// Delete a garage (Admin)
router.delete('/:id', verifyToken, requireRole(['Admin']), garageController.deleteGarage);

module.exports = router;
