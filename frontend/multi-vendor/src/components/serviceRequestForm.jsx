import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/authContext';
// A simple debounce hook to prevent API calls on every keystroke
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const ServiceRequestForm = ({ onNewRequest }) => {
  const [category, setCategory] = useState('Plumbing');
  const [description, setDescription] = useState('');
  const [predictedSeverity, setPredictedSeverity] = useState(null);
  const [loadingSeverity, setLoadingSeverity] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const debouncedDescription = useDebounce(description, 500); // 500ms delay

  useEffect(() => {
    if (debouncedDescription.length > 10) {
      const fetchSeverity = async () => {
        setLoadingSeverity(true);
        try {
          const res = await axios.post('http://localhost:5000/api/requests/predict-severity', {
            description: debouncedDescription,
            category,
          });
          setPredictedSeverity(res.data.predictedSeverity);
        } catch (err) {
          console.error('Failed to predict severity', err);
        }
        setLoadingSeverity(false);
      };
      fetchSeverity();
    } else {
      setPredictedSeverity(null);
    }
  }, [debouncedDescription, category]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/requests', {
        category,
        description,
      });
      // Reset form and notify parent
      setDescription('');
      setCategory('Plumbing');
      setPredictedSeverity(null);
      onNewRequest();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request.');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Create a New Service Request</h3>
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Appliance</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Describe the Issue</label>
          <textarea
            id="description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., My kitchen sink is clogged and the water is not draining..."
          ></textarea>
        </div>

        {loadingSeverity && <p className="text-sm text-gray-500">Analyzing severity...</p>}
        {predictedSeverity && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Predicted Severity:</span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(predictedSeverity)}`}>
              {predictedSeverity}
            </span>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading || description.length < 10}
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceRequestForm;