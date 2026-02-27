const { Transaction, Services, Sparepart, User } = require('../database/models');

const transactionController = {
    // Create a new transaction (Technician only)
    async createTransaction(req, res) {
        try {
            const { customerId, status, serviceIds, sparepartIds } = req.body;
            const technicianId = req.user.id; // From the token

            // Generate a simple booking ID
            const bookingId = require('crypto').randomUUID();

            let serviceTotal = 0;
            let sparepartsTotal = 0;
            let fetchedServices = [];
            let fetchedSpareparts = [];

            // Fetch and calculate Services
            if (serviceIds && serviceIds.length > 0) {
                fetchedServices = await Services.findAll({ where: { id: serviceIds } });
                serviceTotal = fetchedServices.reduce((acc, curr) => acc + curr.price, 0);
            }

            const newTransaction = await Transaction.create({
                bookingId,
                customerId,
                status: status || 'Pending',
                serviceTotal,
                sparepartsTotal: 0, // Set initial total
                grandTotal: serviceTotal,
                technicianId
            });

            // Associate the many-to-many records
            if (fetchedServices.length > 0) {
                await newTransaction.addServices(fetchedServices);
            }
            if (sparepartIds && sparepartIds.length > 0) {
                fetchedSpareparts = await Sparepart.findAll({ where: { id: sparepartIds } });
                await newTransaction.addSpareparts(fetchedSpareparts);

                // Calculate sparepart total after fetching
                sparepartsTotal = fetchedSpareparts.reduce((acc, curr) => acc + curr.price, 0);

                // Update transaction totals
                await newTransaction.update({
                    sparepartsTotal,
                    grandTotal: serviceTotal + sparepartsTotal
                });
            }

            // Reload to include the relationships in the response
            await newTransaction.reload({
                include: [
                    { model: Services, as: 'services' },
                    { model: Sparepart, as: 'spareparts' }
                ]
            });

            return res.status(201).json({
                message: 'Transaction created successfully',
                data: newTransaction
            });
        } catch (error) {
            console.error('Error creating transaction:', error);
            return res.status(500).json({
                message: 'An error occurred while creating the transaction',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Read all transactions (All roles)
    async getAllTransactions(req, res) {
        try {
            const roleName = req.user.role ? req.user.role.name : '';

            let whereClause = {};
            // If the user is a technician, maybe they should only see their own transactions?
            // The prompt said "Read -> All User", so I will return all transactions (or based on garage).
            // Let's assume for now, it returns all or limits to garage if needed. I'll return all without filters for simplicity as requested.

            const transactions = await Transaction.findAll({
                include: [
                    { model: Services, as: 'services' },
                    { model: Sparepart, as: 'spareparts' },
                    { model: User, as: 'technician', attributes: ['id', 'fullName', 'email'] }
                ]
            });

            return res.status(200).json({
                message: 'Transactions retrieved successfully',
                data: transactions
            });
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return res.status(500).json({
                message: 'An error occurred while retrieving transactions',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Read one transaction by ID (All roles)
    async getTransactionById(req, res) {
        try {
            const { id } = req.params;

            const transaction = await Transaction.findByPk(id, {
                include: [
                    { model: Services, as: 'services' },
                    { model: Sparepart, as: 'spareparts' },
                    { model: User, as: 'technician', attributes: ['id', 'fullName', 'email'] }
                ]
            });

            if (!transaction) {
                return res.status(404).json({
                    message: 'Transaction not found'
                });
            }

            return res.status(200).json({
                message: 'Transaction retrieved successfully',
                data: transaction
            });
        } catch (error) {
            console.error(`Error fetching transaction with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while retrieving the transaction',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Update an existing transaction (Technician only)
    async updateTransaction(req, res) {
        try {
            const { id } = req.params;
            const { status, serviceIds, sparepartIds } = req.body;
            const technicianId = req.user.id;

            const transaction = await Transaction.findByPk(id, {
                include: [
                    { model: Services, as: 'services' },
                    { model: Sparepart, as: 'spareparts' }
                ]
            });

            if (!transaction) {
                return res.status(404).json({
                    message: 'Transaction not found'
                });
            }

            // Check if the current technician owns this transaction
            if (transaction.technicianId !== technicianId) {
                return res.status(403).json({
                    message: 'Access denied: You can only update your own transactions.'
                });
            }

            let serviceTotal = transaction.serviceTotal;
            let sparepartsTotal = transaction.sparepartsTotal;

            // If updating services
            if (serviceIds) {
                const fetchedServices = await Services.findAll({ where: { id: serviceIds } });
                serviceTotal = fetchedServices.reduce((acc, curr) => acc + curr.price, 0);
                await transaction.setServices(fetchedServices);
            }

            // If updating spareparts
            if (sparepartIds) {
                const fetchedSpareparts = await Sparepart.findAll({ where: { id: sparepartIds } });
                sparepartsTotal = fetchedSpareparts.reduce((acc, curr) => acc + curr.price, 0);
                await transaction.setSpareparts(fetchedSpareparts);
            }

            const grandTotal = serviceTotal + sparepartsTotal;

            const updateData = {};
            if (status !== undefined) updateData.status = status;
            updateData.serviceTotal = serviceTotal;
            updateData.sparepartsTotal = sparepartsTotal;
            updateData.grandTotal = grandTotal;

            await transaction.update(updateData);

            await transaction.reload({
                include: [
                    { model: Services, as: 'services' },
                    { model: Sparepart, as: 'spareparts' }
                ]
            });

            return res.status(200).json({
                message: 'Transaction updated successfully',
                data: transaction
            });
        } catch (error) {
            console.error(`Error updating transaction with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while updating the transaction',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Delete a transaction (Soft delete) (Admin only)
    async deleteTransaction(req, res) {
        try {
            const { id } = req.params;

            const transaction = await Transaction.findByPk(id);

            if (!transaction) {
                return res.status(404).json({
                    message: 'Transaction not found'
                });
            }

            // This will perform a soft delete because "paranoid: true" is set on the model
            await transaction.destroy();

            return res.status(200).json({
                message: 'Transaction deleted successfully (soft deleted)'
            });
        } catch (error) {
            console.error(`Error deleting transaction with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while deleting the transaction',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = transactionController;
