import ServiceRequest from '../models/ServiceRequest.js';

/**
 * @desc    Create a new service request
 * @route   POST /api/requests
 * @access  Private
 */
export const createServiceRequest = async (req, res) => {
  const { category, description } = req.body;

  try {
    // We can access req.user._id because our 'protect' middleware added it.
    const request = new ServiceRequest({
      customer: req.user._id, // Link the request to the logged-in user
      category,
      description,
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};