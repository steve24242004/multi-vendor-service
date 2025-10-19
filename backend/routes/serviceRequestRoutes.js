import express from 'express';
import {
  createServiceRequest,
  getMyServiceRequests,
  getAllServiceRequests, // 1. Import the new controller function
} from '../controllers/serviceRequestController.js';
import { protect, technician } from '../middleware/authMiddleware.js'; // 2. Import the technician middleware

const router = express.Router();

// --- Customer Routes ---
router.post('/', protect, createServiceRequest);
router.get('/myrequests', protect, getMyServiceRequests);

// --- Technician Route ---
// 3. Add the new route. Notice the middleware order:
// First 'protect' runs to check if they are logged in.
// If that passes, 'technician' runs to check their role.
// If that passes, 'getAllServiceRequests' runs.
router.get('/', protect, technician, getAllServiceRequests);

export default router;