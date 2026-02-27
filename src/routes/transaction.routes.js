const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { Role } = require('../database/models');

// Fetch allowed roles dynamically from the database
const allRoles = [];
Role.findAll()
    .then(roles => {
        allRoles.push(...roles.map(r => r.name));
    })
    .catch(err => console.error('Failed to fetch roles for transaction endpoints:', err));


// Read all transactions (All User roles)
router.get('/', verifyToken, requireRole(allRoles), transactionController.getAllTransactions);

// Read a single transaction by ID (All User roles)
router.get('/:id', verifyToken, requireRole(allRoles), transactionController.getTransactionById);

// Create a new transaction (Technician)
router.post('/', verifyToken, requireRole(['Technician']), transactionController.createTransaction);

// Update an existing transaction (Technician)
router.put('/:id', verifyToken, requireRole(['Technician']), transactionController.updateTransaction);

// Delete/Soft Delete a transaction (Admin)
router.delete('/:id', verifyToken, requireRole(['Admin']), transactionController.deleteTransaction);

module.exports = router;
