const { User } = require('../database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key'; // fallback for development

const authController = {
    // Register a new user
    async register(req, res) {
        try {
            let { fullName, email, password, photoUrl, phone } = req.body;

            // Handle file upload
            if (req.file) {
                photoUrl = `/public/profiles/${req.file.filename}`;
            }

            // Basic validation
            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email and password are required'
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({
                    message: 'User with this email already exists'
                });
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create new user
            const newUser = await User.create({
                fullName,
                email,
                password: hashedPassword,
                photoUrl,
                phone
            });

            // Remove password before sending response
            const userResponse = newUser.toJSON();
            delete userResponse.password;

            return res.status(201).json({
                message: 'User registered successfully',
                user: userResponse
            });
        } catch (error) {
            console.error('Error during user registration:', error);
            return res.status(500).json({
                message: 'An error occurred during registration',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Login an existing user
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Basic validation
            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email and password are required'
                });
            }

            // Find user
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid email or password'
                });
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    message: 'Invalid email or password'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Remove password before sending user data
            const userResponse = user.toJSON();
            delete userResponse.password;

            return res.status(200).json({
                message: 'Login successful',
                token,
                user: userResponse
            });
        } catch (error) {
            console.error('Error during user login:', error);
            return res.status(500).json({
                message: 'An error occurred during login',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = authController;
