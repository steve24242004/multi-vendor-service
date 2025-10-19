import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// This function checks if the user is logged in
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- NEW FUNCTION ---
// This function checks if the user is a Technician
export const technician = (req, res, next) => {
  // We check the user object that was attached by the 'protect' middleware.
  if (req.user && req.user.role === 'Technician') {
    // If they are a technician, move on to the next function.
    next();
  } else {
    // If not, send a 403 Forbidden error.
    res.status(403).json({ message: 'Not authorized as a Technician' });
  }
};