const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authentication Middleware
 * Verifies JWT token from request headers
 */
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token provided' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

/**
 * Authorization Middleware - Check Role
 * Ensures user has required role
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }
    
    if (!allowedRoles.includes(req.user.userRole)) {
      logger.warn(`Unauthorized access attempt by user ${req.user.userID}`);
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions for this action' 
      });
    }
    
    next();
  };
};

/**
 * Office Code Validation
 * Ensures user can only access their office data
 */
const validateOfficeAccess = (req, res, next) => {
  const { officeCode } = req.body;
  
  // Admin can access all offices
  if (req.user.userRole === 'Admin') {
    return next();
  }
  
  // Others can only access their own office
  if (officeCode && officeCode !== req.user.officeCode) {
    return res.status(403).json({ 
      success: false, 
      message: 'Cannot access data from other offices' 
    });
  }
  
  next();
};

/**
 * Customer Access Control
 * Customers can only view their own data
 */
const customerAccessControl = (req, res, next) => {
  const { custID } = req.params;
  
  // If user is a customer (not staff)
  if (req.user.userRole === 'Customer') {
    if (parseInt(custID) !== req.user.custID) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only access your own information' 
      });
    }
  }
  
  next();
};

module.exports = {
  authenticate,
  authorize,
  validateOfficeAccess,
  customerAccessControl
};