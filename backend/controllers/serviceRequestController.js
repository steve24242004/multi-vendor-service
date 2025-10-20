import ServiceRequest from '../models/ServiceRequest.js';

/**
 * @desc    Create a new service request
 * @route   POST /api/requests
 * @access  Private
 */
export const createServiceRequest = async (req, res) => {
  // 1. Get severity from the request body
  const { category, description, severity } = req.body;

  try {
    const request = new ServiceRequest({
      customer: req.user._id,
      category,
      description,
      // 2. Save the severity, defaulting to 'Low' if it's not provided
      severity: severity || 'Low',
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

// Add this new function to the bottom of your controller file.

/**
 * @desc    Predict the severity of a service request based on its description and category.
 * @route   POST /api/requests/predict-severity
 * @access  Private
 */
export const predictSeverity = async (req, res) => {
  const { description, category } = req.body;

  if (!description || !category) {
    return res
      .status(400)
      .json({ message: 'Description and category are required.' });
  }

  const lowerCaseDescription = description.toLowerCase();
  let predictedSeverity = 'Low'; // Default severity

  // --- AI Keyword Logic ---
  const severityKeywords = {
    High: [
      'fire', 'spark', 'gas', 'leak', 'burst', 'flood',
      'smell', 'no power', 'emergency', 'urgent', 'explosion'
    ],
    Medium: [
      'broken', 'not working', 'stopped', 'clogged',
      'no hot water', 'major leak', 'faulty', 'stuck'
    ],
    Low: [
      'dripping', 'noisy', 'flickering', 'loose',
      'slow', 'minor', 'cosmetic', 'intermittent'
    ],
  };

  // Check for High severity keywords first, as they are the most important.
  if (severityKeywords.High.some(word => lowerCaseDescription.includes(word))) {
    predictedSeverity = 'High';
  }
  // If not high, check for Medium severity.
  else if (
    severityKeywords.Medium.some(word => lowerCaseDescription.includes(word))
  ) {
    predictedSeverity = 'Medium';
  }

  // You could add more complex, category-specific logic here if you wanted.
  // For example, "leak" in "Plumbing" might be Medium, but "leak" with "gas" is always High.
  // For now, this general check is a great starting point.

  res.json({ predictedSeverity });
};