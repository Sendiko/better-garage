const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { Role } = require('../database/models');
const upload = require('../middlewares/upload.middleware');

// Fetch allowed roles dynamically from the database
const allRoles = [];
Role.findAll()
    .then(roles => {
        allRoles.push(...roles.map(r => r.name));
    })
    .catch(err => console.error('Failed to fetch roles for services endpoints:', err));

// Read all services (all roles)
router.get('/', verifyToken, requireRole(allRoles), servicesController.getAllServices);

// Read a single service by ID (all roles)
router.get('/:id', verifyToken, requireRole(allRoles), servicesController.getServiceById);

// Create a new service (Admin)
router.post('/', verifyToken, requireRole(['Admin']), upload.none(), servicesController.createService);

// Update an existing service (Admin)
router.put('/:id', verifyToken, requireRole(['Admin']), upload.none(), servicesController.updateService);

// Delete a service (Admin)
router.delete('/:id', verifyToken, requireRole(['Admin']), servicesController.deleteService);

module.exports = router;
