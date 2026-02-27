const express = require('express');
const router = express.Router();
const sparepartController = require('../controllers/sparepart.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Create a new sparepart (Admin or Technician)
router.post('/', verifyToken, requireRole(['Admin', 'Technician']), upload.single('photo'), sparepartController.createSparepart);

// Read all spareparts (Admin or Technician)
router.get('/', verifyToken, requireRole(['Admin', 'Technician']), sparepartController.getSpareparts);

// Read a single sparepart by ID (Admin or Technician)
router.get('/:id', verifyToken, requireRole(['Admin', 'Technician']), sparepartController.getSparepartById);

// Update an existing sparepart (Admin or Technician)
router.put('/:id', verifyToken, requireRole(['Admin', 'Technician']), upload.single('photo'), sparepartController.updateSparepart);

// Delete a sparepart (Admin or Technician)
router.delete('/:id', verifyToken, requireRole(['Admin', 'Technician']), sparepartController.deleteSparepart);

module.exports = router;
