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

            // Only allow Admin to create a garage if they are not already assigned to one (optional, or remove this check if Admins can create multiple, but based on "same garageId", it implies an admin is tied to a garage)
            // Or if an Admin is creating a garage and doesn't belong to one, assign them to it.
            // Assuming we allow creation but they can only interact with their own garage afterwards.

            // To be safe, if we strictly want them to be tied to a garage, maybe we just record the created garage and attach it to them.
            // But the prompt says: make sure only admin with the "same garageId" can access it.
            // For creation, they wouldn't have the garageId yet, or this means they can only create garages if they are NOT attached?
            // Actually, if they are "editing" or "deleting", the garageId must match. For creation, they shouldn't be able to create if they already have one, or they can create and be assigned to it.
            // Let's implement assignment on creation, or block creation if they already have one.

            if (req.user.role && req.user.role.name === 'Admin') {
                // For now allow creation and we shouldn't block it since creating is how a garage is born.
                // We will just let them create it. If you strictly want them to only have 1 garage:
                if (req.user.garageId) {
                    return res.status(403).json({
                        message: 'Access denied: You are already assigned to a garage.'
                    });
                }
            }

            const newGarage = await Garage.create({
                name,
                description,
                photoUrl,
                bannerPhoto
            });

            // Automatically assign the newly created garage to the Admin if they didn't have one
            if (req.user.role && req.user.role.name === 'Admin' && !req.user.garageId) {
                await req.user.update({ garageId: newGarage.id });
            }

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

            // Validation: Ensure the admin belongs to this garage
            if (req.user.role && req.user.role.name === 'Admin') {
                if (req.user.garageId !== garage.id) {
                    return res.status(403).json({
                        message: 'Access denied: You can only update your own garage.'
                    });
                }
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

            // Validation: Ensure the admin belongs to this garage
            if (req.user.role && req.user.role.name === 'Admin') {
                if (req.user.garageId !== garage.id) {
                    return res.status(403).json({
                        message: 'Access denied: You can only delete your own garage.'
                    });
                }
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
