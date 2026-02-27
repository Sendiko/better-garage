const { Sparepart } = require('../database/models');

const sparepartController = {
    // Create a new sparepart
    async createSparepart(req, res) {
        try {
            let { name, partNumber, brand, category, price } = req.body;
            let photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
            const { garageId } = req.user;

            if (!garageId) {
                return res.status(403).json({
                    message: 'Access denied: You must be assigned to a garage to create spareparts.'
                });
            }

            if (!name) {
                return res.status(400).json({
                    message: 'Sparepart name is required'
                });
            }

            const newSparepart = await Sparepart.create({
                name,
                partNumber,
                brand,
                category,
                price: price || 0,
                photoUrl,
                garageId
            });

            return res.status(201).json({
                message: 'Sparepart created successfully',
                data: newSparepart
            });
        } catch (error) {
            console.error('Error creating sparepart:', error);
            return res.status(500).json({
                message: 'An error occurred while creating the sparepart',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Read all spareparts for the user's garage
    async getSpareparts(req, res) {
        try {
            const { garageId } = req.user;

            if (!garageId) {
                return res.status(403).json({
                    message: 'Access denied: You must be assigned to a garage to view spareparts.'
                });
            }

            const spareparts = await Sparepart.findAll({
                where: { garageId }
            });

            return res.status(200).json({
                message: 'Spareparts retrieved successfully',
                data: spareparts
            });
        } catch (error) {
            console.error('Error fetching spareparts:', error);
            return res.status(500).json({
                message: 'An error occurred while retrieving spareparts',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Read a single sparepart by ID
    async getSparepartById(req, res) {
        try {
            const { id } = req.params;
            const { garageId } = req.user;

            const sparepart = await Sparepart.findByPk(id);

            if (!sparepart) {
                return res.status(404).json({
                    message: 'Sparepart not found'
                });
            }

            // Ensure the user belongs to the same garage as the sparepart
            if (sparepart.garageId !== garageId) {
                return res.status(403).json({
                    message: 'Access denied: You can only view spareparts in your own garage.'
                });
            }

            return res.status(200).json({
                message: 'Sparepart retrieved successfully',
                data: sparepart
            });
        } catch (error) {
            console.error(`Error fetching sparepart with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while retrieving the sparepart',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Update an existing sparepart
    async updateSparepart(req, res) {
        try {
            const { id } = req.params;
            const { garageId } = req.user;
            let { name, partNumber, brand, category, price } = req.body;
            let photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

            const sparepart = await Sparepart.findByPk(id);

            if (!sparepart) {
                return res.status(404).json({
                    message: 'Sparepart not found'
                });
            }

            // Validation: Ensure the user belongs to this garage
            if (sparepart.garageId !== garageId) {
                return res.status(403).json({
                    message: 'Access denied: You can only update spareparts in your own garage.'
                });
            }

            // Prepare update payload
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (partNumber !== undefined) updateData.partNumber = partNumber;
            if (brand !== undefined) updateData.brand = brand;
            if (category !== undefined) updateData.category = category;
            if (price !== undefined) updateData.price = price;
            if (photoUrl !== undefined) updateData.photoUrl = photoUrl;

            await sparepart.update(updateData);

            return res.status(200).json({
                message: 'Sparepart updated successfully',
                data: sparepart
            });
        } catch (error) {
            console.error(`Error updating sparepart with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while updating the sparepart',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Delete a sparepart
    async deleteSparepart(req, res) {
        try {
            const { id } = req.params;
            const { garageId } = req.user;

            const sparepart = await Sparepart.findByPk(id);

            if (!sparepart) {
                return res.status(404).json({
                    message: 'Sparepart not found'
                });
            }

            // Validation: Ensure the user belongs to this garage
            if (sparepart.garageId !== garageId) {
                return res.status(403).json({
                    message: 'Access denied: You can only delete spareparts in your own garage.'
                });
            }

            await sparepart.destroy();

            return res.status(200).json({
                message: 'Sparepart deleted successfully'
            });
        } catch (error) {
            console.error(`Error deleting sparepart with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while deleting the sparepart',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = sparepartController;
