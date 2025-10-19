import express from 'express';
// 1. Import the new loginUser function
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Route for registering a user
router.post('/register', registerUser);

// 2. Add the new route for logging in a user
router.post('/login', loginUser);

export default router;