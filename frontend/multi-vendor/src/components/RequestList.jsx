import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const RequestList = ({ refreshTrigger }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_URL}api/requests/myrequests`);
        const sortedRequests = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRequests(sortedRequests);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch requests.');
      }
      setLoading(false);
    };

    fetchRequests();
  }, [refreshTrigger]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800';
      case 'InProgress':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading your requests...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">My Service Requests</h3>
      {requests.length === 0 ? (
        <p className="p-4 text-center text-gray-500 bg-white rounded-lg shadow-md">You have not created any requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-700">{req.category}</p>
                  <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                  {req.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Requested on: {new Date(req.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestList;