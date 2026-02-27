const jwt = require('jsonwebtoken');
const { User, Role } = require('../database/models');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key'; // fallback for development

// Middleware to verify the JWT token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token requires Bearer format' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch user AND their associated Role from the database
        const user = await User.findByPk(decoded.id, {
            include: [{ model: Role, as: 'role' }] // Ensure 'as' matches the association in user.js
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found or token invalid' });
        }

        // Attach user to the request object so downstream routes/middleware can access it
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

// Middleware Factory to check if user has the required roles
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Safety check: ensure verifyToken ran first
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }

        // Safety check: ensure the user actually has a role assigned
        if (!req.user.role || !req.user.role.name) {
            return res.status(403).json({ message: 'Access denied: No role assigned to user' });
        }

        // Check if the user's role is in the list of allowed roles
        if (allowedRoles.includes(req.user.role.name)) {
            next(); // Role is allowed, proceed to the controller
        } else {
            return res.status(403).json({
                message: 'Access denied: Insufficient permissions for this action'
            });
        }
    };
};

module.exports = {
    verifyToken,
    requireRole
};
