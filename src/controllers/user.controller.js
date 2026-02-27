const { User } = require('../database/models');
const bcrypt = require('bcrypt');

const userController = {
    // Read all users
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] } // Don't send passwords
            });

            return res.status(200).json({
                message: 'Users retrieved successfully',
                data: users
            });
        } catch (error) {
            console.error('Error fetching all users:', error);
            return res.status(500).json({
                message: 'An error occurred while retrieving users',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Read a single user by ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            return res.status(200).json({
                message: 'User retrieved successfully',
                data: user
            });
        } catch (error) {
            console.error(`Error fetching user with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while retrieving the user',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Create a new user (Note: auth.controller handles registration, this is for admin creation)
    async createUser(req, res) {
        try {
            const { fullName, email, password, photoUrl, phone, roleId } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email and password are required'
                });
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({
                    message: 'User with this email already exists'
                });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await User.create({
                fullName,
                email,
                password: hashedPassword,
                photoUrl,
                phone,
                roleId
            });

            const userResponse = newUser.toJSON();
            delete userResponse.password;

            return res.status(201).json({
                message: 'User created successfully',
                data: userResponse
            });
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({
                message: 'An error occurred while creating the user',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Update an existing user
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { fullName, email, password, photoUrl, phone, roleId } = req.body;

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Prepare update payload
            const updateData = {};
            if (fullName !== undefined) updateData.fullName = fullName;
            if (email !== undefined) {
                // Check if the new email belongs to someone else
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser && existingUser.id !== parseInt(id, 10)) {
                    return res.status(409).json({
                        message: 'Email is already in use by another account'
                    });
                }
                updateData.email = email;
            }
            if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
            if (phone !== undefined) updateData.phone = phone;
            if (roleId !== undefined) updateData.roleId = roleId;

            // Handle password update if provided
            if (password) {
                const saltRounds = 10;
                updateData.password = await bcrypt.hash(password, saltRounds);
            }

            await user.update(updateData);

            // Fetch fresh data without password to return
            const updatedUser = await User.findByPk(id, {
                attributes: { exclude: ['password'] }
            });

            return res.status(200).json({
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (error) {
            console.error(`Error updating user with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while updating the user',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Delete a user
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            await user.destroy();

            return res.status(200).json({
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error(`Error deleting user with ID ${req.params.id}:`, error);
            return res.status(500).json({
                message: 'An error occurred while deleting the user',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = userController;
