const { User, Role } = require('../database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key'; // fallback for development
const TOKEN_EXPIRATION = process.env.JWT_EXPIRES_IN || '24h';

const createToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

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

            // Fetch the default role for new registrations
            const defaultRole = await Role.findOne({ where: { name: 'Customer' } });

            // Create new user
            const newUser = await User.create({
                fullName,
                email,
                password: hashedPassword,
                photoUrl,
                phone,
                roleId: defaultRole ? defaultRole.id : null // Assign default role
            });

            // Remove password before sending response
            const userResponse = newUser.toJSON();
            delete userResponse.password;

            if (defaultRole) {
                userResponse.role = {
                    id: defaultRole.id,
                    name: defaultRole.name
                };
            }
            delete userResponse.roleId;

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

    // Register a new garage owner
    async registerOwner(req, res) {
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

            // Fetch the default role for garage owners
            const ownerRole = await Role.findOne({ where: { name: 'Admin' } });

            // Create new user
            const newUser = await User.create({
                fullName,
                email,
                password: hashedPassword,
                photoUrl,
                phone,
                roleId: ownerRole ? ownerRole.id : null // Assign owner role
            });

            // Remove password before sending response
            const userResponse = newUser.toJSON();
            delete userResponse.password;

            if (ownerRole) {
                userResponse.role = {
                    id: ownerRole.id,
                    name: ownerRole.name
                };
            }
            delete userResponse.roleId;

            // Generate JWT token
            const token = createToken({ id: newUser.id, email: newUser.email });

            return res.status(201).json({
                message: 'Garage owner registered successfully',
                token,
                user: userResponse
            });
        } catch (error) {
            console.error('Error during garage owner registration:', error);
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
            const user = await User.findOne({
                where: { email },
                include: [{ model: Role, as: 'role' }]
            });
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
            const token = createToken({ id: user.id, email: user.email });

            // Remove the roleId and password from the final response object to keep logic consistent
            const userResponse = user.toJSON();
            delete userResponse.password;
            delete userResponse.roleId;

            if (userResponse.role) {
                userResponse.role = {
                    id: userResponse.role.id,
                    name: userResponse.role.name
                };
            }

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
    },

    // Refresh access token using an expired or valid token
    async refreshToken(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.body.token;

            if (!token) {
                return res.status(400).json({ message: 'Token is required to refresh' });
            }

            let decoded;
            try {
                decoded = jwt.verify(token, JWT_SECRET);
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
                } else {
                    return res.status(401).json({ message: 'Invalid token' });
                }
            }

            const user = await User.findByPk(decoded.id, {
                include: [{ model: Role, as: 'role' }]
            });

            if (!user) {
                return res.status(401).json({ message: 'User not found or token invalid' });
            }

            const newToken = createToken({ id: user.id, email: user.email });
            const userResponse = user.toJSON();
            delete userResponse.password;
            delete userResponse.roleId;

            if (userResponse.role) {
                userResponse.role = {
                    id: userResponse.role.id,
                    name: userResponse.role.name
                };
            }

            return res.status(200).json({
                message: 'Token refreshed successfully',
                token: newToken,
                user: userResponse
            });
        } catch (error) {
            console.error('Error refreshing token:', error);
            return res.status(500).json({
                message: 'An error occurred while refreshing token',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = authController;
