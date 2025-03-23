// middleware/verificationMiddleware.js
const jwt = require('jsonwebtoken');
const { IndividualKYC } = require('../models/kycSchema');

const requireVerification = async (req, res, next) => {
  try {
    // Get token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    // Check if user is verified
    const user = await IndividualKYC.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.verificationStatus !== 'verified') {
      return res.status(403).json({
        message: 'User not verified',
        status: user.verificationStatus,
        requiresVerification: true
      });
    }
    
    // Add user info to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Verification middleware error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  requireVerification
};