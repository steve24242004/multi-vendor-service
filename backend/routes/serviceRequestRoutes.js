import express from 'express';
import {
  createServiceRequest,
  getMyServiceRequests,
  getAllServiceRequests,
  updateServiceRequestStatus,
  predictSeverity, // 1. Import the new AI controller function
} from '../controllers/serviceRequestController.js';
import { protect, technician } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- AI Route ---
// 2. Add the route for the AI feature. It's protected so only logged-in users can use it.
router.post('/predict-severity', protect, predictSeverity);


// --- Customer Routes ---
router.post('/', protect, createServiceRequest);
router.get('/myrequests', protect, getMyServiceRequests);

// --- Technician Routes ---
router.get('/', protect, technician, getAllServiceRequests);
router.put('/:id', protect, technician, updateServiceRequestStatus);


export default router;