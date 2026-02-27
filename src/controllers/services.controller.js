const { Services, Garage } = require('../database/models');

const servicesController = {
    // Read all services
    async getAllServices(req, res) {
        try {
            const services = await Services.findAll();

            return res.status(200).json({
                message: 'Services retrieved successfully',
                data: services
            });
        } catch (error) {
            console.error('Error fetching all services:', error);
            return res.status(500).json({
                message: 'An error occurred while retrieving services',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Read a single service by ID
    async getServiceById(req, res) {
        try {
            const { id } = req.params;

            const service = await Services.findByPk(id);

            if (!service) {
                return res.status(404).json({
                    message: 'Service not found'
                });
            }

            return res.status(200).json({
                message: 'Service retrieved successfully',
                data: service
            });
        } catch (error) {
            console.error(`Error fetching service with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while retrieving the service',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Create a new service
    async createService(req, res) {
        try {
            // An admin must be logged in and assigned to a garage to create a service for it
            const { name, description, price } = req.body;
            const garageId = req.user.garageId;

            if (!name || price === undefined) {
                return res.status(400).json({
                    message: 'Service name and price are required'
                });
            }

            if (!garageId) {
                return res.status(403).json({
                    message: 'Access denied: You must be assigned to a garage to create services'
                });
            }

            const newService = await Services.create({
                name,
                description,
                price,
                garageId
            });

            return res.status(201).json({
                message: 'Service created successfully',
                data: newService
            });
        } catch (error) {
            console.error('Error creating service:', error);
            return res.status(500).json({
                message: 'An error occurred while creating the service',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Update an existing service
    async updateService(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price } = req.body;

            const service = await Services.findByPk(id);

            if (!service) {
                return res.status(404).json({
                    message: 'Service not found'
                });
            }

            // Ensure the admin owns the garage this service belongs to
            if (req.user.role && req.user.role.name === 'Admin') {
                if (req.user.garageId !== service.garageId) {
                    return res.status(403).json({
                        message: 'Access denied: You can only update services belonging to your garage'
                    });
                }
            }

            // Prepare update payload
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (price !== undefined) updateData.price = price;

            await service.update(updateData);

            return res.status(200).json({
                message: 'Service updated successfully',
                data: service
            });
        } catch (error) {
            console.error(`Error updating service with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while updating the service',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Delete a service
    async deleteService(req, res) {
        try {
            const { id } = req.params;

            const service = await Services.findByPk(id);

            if (!service) {
                return res.status(404).json({
                    message: 'Service not found'
                });
            }

            // Ensure the admin owns the garage this service belongs to
            if (req.user.role && req.user.role.name === 'Admin') {
                if (req.user.garageId !== service.garageId) {
                    return res.status(403).json({
                        message: 'Access denied: You can only delete services belonging to your garage'
                    });
                }
            }

            await service.destroy();

            return res.status(200).json({
                message: 'Service deleted successfully'
            });
        } catch (error) {
            console.error(`Error deleting service with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while deleting the service',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = servicesController;
