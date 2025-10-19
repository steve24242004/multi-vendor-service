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

// Add this to the bottom of your controller file

/**
 * @desc    Get all service requests (Admin/Technician only)
 * @route   GET /api/requests
 * @access  Private/Technician
 */
export const getAllServiceRequests = async (req, res) => {
  try {
    // Find all requests and sort them by the newest first.
    const requests = await ServiceRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// Add this new function to the bottom of serviceRequestController.js

/**
 * @desc    Update a service request's status
 * @route   PUT /api/requests/:id
 * @access  Private/Technician
 */
export const updateServiceRequestStatus = async (req, res) => {
  try {
    // Find the specific request by its ID, which comes from the URL parameter
    const request = await ServiceRequest.findById(req.params.id);

    if (request) {
      // Update the status with the value sent in the request body
      request.status = req.body.status || request.status;

      // If the status is being set to 'Assigned' or 'InProgress',
      // assign the currently logged-in technician to the request.
      if (req.body.status === 'Assigned' || req.body.status === 'InProgress') {
        request.technician = req.user._id;
      }

      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Service Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};