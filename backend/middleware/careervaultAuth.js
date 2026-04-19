const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectVault = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.error('Vault Auth Error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminOrUploader = (req, res, next) => {
    // If we need to verify ownership, this middleware can be attached
    // Or we handle ownership check inside the controller itself.
    // For now, we will add an admin check here
    if (req.user && req.user.role === 'admin') {
        req.isAdmin = true;
    } else {
        req.isAdmin = false;
    }
    next();
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};

module.exports = { protectVault, adminOrUploader, adminOnly };
