'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to verify JWT token from the Authorization header.
 * Expected header format: Authorization: Bearer <token>
 */
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

// Middleware to allow only users with specific roles.

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
    }
    next();
  };
}

module.exports = {
  verifyJWT,
  requireRole,
};
