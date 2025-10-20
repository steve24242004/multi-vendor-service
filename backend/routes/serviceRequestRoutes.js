import express from 'express';
import {
  createServiceRequest,
  getMyServiceRequests,
  getAllServiceRequests,
  updateServiceRequestStatus,
  predictSeverity,
} from '../controllers/serviceRequestController.js';
import { protect, technician } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/predict-severity', protect, predictSeverity);
router.post('/', protect, createServiceRequest);
router.get('/myrequests', protect, getMyServiceRequests);
router.get('/', protect, technician, getAllServiceRequests);
router.put('/:id', protect, technician, updateServiceRequestStatus);

export default router;