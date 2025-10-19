import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token for a given user ID.
 * @param {string} id The user's MongoDB document ID.
 * @returns {string} The generated JWT.
 */
const generateToken = (id) => {
  // This creates a token that includes the user's ID, is signed with your secret key,
  // and will expire in 30 days.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;

