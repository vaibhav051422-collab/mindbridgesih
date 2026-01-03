const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or inactive user' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Middleware for anonymous users
const authenticateAnonymous = async (req, res, next) => {
  try {
    const anonymousId = req.headers['x-anonymous-id'];
    
    if (!anonymousId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Anonymous ID required' 
      });
    }

    let user = await User.findOne({ anonymousId, isAnonymous: true });
    
    if (!user) {
      // Create new anonymous user
      user = new User({
        userType: 'anonymous',
        isAnonymous: true,
        anonymousId: anonymousId
      });
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Anonymous authentication error' 
    });
  }
};

// Middleware to check user type
const requireUserType = (allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Middleware to check if user belongs to institute
const requireInstituteAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const instituteId = req.params.instituteId || req.body.instituteId;
    
    if (!instituteId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Institute ID required' 
      });
    }

    // Check if user belongs to this institute
    if (req.user.institute && req.user.institute.toString() !== instituteId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied to this institute' 
      });
    }

    req.instituteId = instituteId;
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Institute access check failed' 
    });
  }
};

module.exports = {
  authenticateToken,
  authenticateAnonymous,
  requireUserType,
  requireInstituteAccess
};
