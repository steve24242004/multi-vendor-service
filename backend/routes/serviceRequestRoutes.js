import express from 'express';
import {
  createServiceRequest,
  getMyServiceRequests,
  getAllServiceRequests,
  updateServiceRequestStatus, // 1. Import the new controller function
} from '../controllers/serviceRequestController.js';
import { protect, technician } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Customer Routes ---
router.post('/', protect, createServiceRequest);
router.get('/myrequests', protect, getMyServiceRequests);

// --- Technician Routes ---
router.get('/', protect, technician, getAllServiceRequests);

// 2. Add the new route for updating a request.
// The ':id' is a placeholder for the actual ID of the request.
router.put('/:id', protect, technician, updateServiceRequestStatus);

export default router;