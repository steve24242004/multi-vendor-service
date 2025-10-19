import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// This function will protect our routes
export const protect = async (req, res, next) => {
  let token;

  // Check if the request has an Authorization header, and if it starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from the header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID that was stored in the token.
      // Attach the user's data to the request object, but exclude the password.
      req.user = await User.findById(decoded.id).select('-password');

      // Move on to the next function (the actual controller)
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