/**
 * This is our "controller" function for registering a user.
 * For now, it will just send a success message to confirm it's working.
 *
 * @param {object} req - The request object from the client.
 * @param {object} res - The response object to send back to the client.
 */
export const registerUser = async (req, res) => {
  // For now, just confirm that this function was called successfully.
  res.status(200).json({ message: 'Register User controller hit successfully!' });
};