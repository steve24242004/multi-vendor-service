import ServiceRequest from '../models/ServiceRequest.js';

/**
 * @desc    Create a new service request
 * @route   POST /api/requests
 * @access  Private
 */
export const createServiceRequest = async (req, res) => {
  const { category, description } = req.body;

  try {
    const request = new ServiceRequest({
      customer: req.user._id,
      category,
      description,
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all service requests for the logged-in user
 * @route   GET /api/requests/myrequests
 * @access  Private
 */
export const getMyServiceRequests = async (req, res) => {
  try {
    // Find all requests where the 'customer' field matches the logged-in user's ID
    const requests = await ServiceRequest.find({ customer: req.user._id });

    if (requests) {
      res.json(requests);
    } else {
      res.status(404).json({ message: 'No requests found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};