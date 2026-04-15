const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// Dashboard endpoints for Admin and Technician
router.get('/summary', verifyToken, requireRole(['Admin', 'Technician']), dashboardController.getDashboardSummary);
router.get('/activity', verifyToken, requireRole(['Admin', 'Technician']), dashboardController.getDashboardActivity);

module.exports = router;
