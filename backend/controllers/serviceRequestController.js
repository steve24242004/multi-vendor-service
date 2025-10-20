import ServiceRequest from '../models/ServiceRequest.js';

export const createServiceRequest = async (req, res) => {
  const { category, description, severity } = req.body;

  try {
    const request = new ServiceRequest({
      customer: req.user._id,
      category,
      description,
      severity: severity || 'Low',
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getMyServiceRequests = async (req, res) => {
  try {
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

export const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateServiceRequestStatus = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (request) {
      request.status = req.body.status || request.status;

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

export const predictSeverity = async (req, res) => {
  const { description, category } = req.body;

  if (!description || !category) {
    return res
      .status(400)
      .json({ message: 'Description and category are required.' });
  }

  const lowerCaseDescription = description.toLowerCase();
  let predictedSeverity = 'Low';

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

  if (severityKeywords.High.some(word => lowerCaseDescription.includes(word))) {
    predictedSeverity = 'High';
  } else if (
    severityKeywords.Medium.some(word => lowerCaseDescription.includes(word))
  ) {
    predictedSeverity = 'Medium';
  }

  res.json({ predictedSeverity });
};