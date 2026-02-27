const { Garage } = require('../database/models');

const garageController = {
    // Read all garages
    async getAllGarages(req, res) {
        try {
            const garages = await Garage.findAll();

            return res.status(200).json({
                message: 'Garages retrieved successfully',
                data: garages
            });
        } catch (error) {
            console.error('Error fetching all garages:', error);
            return res.status(500).json({
                message: 'An error occurred while retrieving garages',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Read a single garage by ID
    async getGarageById(req, res) {
        try {
            const { id } = req.params;

            const garage = await Garage.findByPk(id);

            if (!garage) {
                return res.status(404).json({
                    message: 'Garage not found'
                });
            }

            return res.status(200).json({
                message: 'Garage retrieved successfully',
                data: garage
            });
        } catch (error) {
            console.error(`Error fetching garage with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while retrieving the garage',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Create a new garage
    async createGarage(req, res) {
        try {
            const { name, description, photoUrl, bannerPhoto } = req.body;

            if (!name) {
                return res.status(400).json({
                    message: 'Garage name is required'
                });
            }

            const newGarage = await Garage.create({
                name,
                description,
                photoUrl,
                bannerPhoto
            });

            return res.status(201).json({
                message: 'Garage created successfully',
                data: newGarage
            });
        } catch (error) {
            console.error('Error creating garage:', error);
            return res.status(500).json({
                message: 'An error occurred while creating the garage',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Update an existing garage
    async updateGarage(req, res) {
        try {
            const { id } = req.params;
            const { name, description, photoUrl, bannerPhoto } = req.body;

            const garage = await Garage.findByPk(id);

            if (!garage) {
                return res.status(404).json({
                    message: 'Garage not found'
                });
            }

            // Prepare update payload
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
            if (bannerPhoto !== undefined) updateData.bannerPhoto = bannerPhoto;

            await garage.update(updateData);

            return res.status(200).json({
                message: 'Garage updated successfully',
                data: garage
            });
        } catch (error) {
            console.error(`Error updating garage with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while updating the garage',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Delete a garage
    async deleteGarage(req, res) {
        try {
            const { id } = req.params;

            const garage = await Garage.findByPk(id);

            if (!garage) {
                return res.status(404).json({
                    message: 'Garage not found'
                });
            }

            await garage.destroy();

            return res.status(200).json({
                message: 'Garage deleted successfully'
            });
        } catch (error) {
            console.error(`Error deleting garage with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while deleting the garage',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = garageController;
