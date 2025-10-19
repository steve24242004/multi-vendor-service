import express from 'express';
// We need to import our controller function to tell the route what to do.
import { registerUser } from '../controllers/userController.js';

// This creates a new router object to manage our routes.
const router = express.Router();

// This line says:
// "When a POST request is made to the '/register' URL,
// execute the 'registerUser' function from the controller."
router.post('/register', registerUser);

export default router;