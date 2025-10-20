import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TechnicianDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/requests');
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRequests(sortedData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${requestId}`, {
        status: newStatus,
      });
      fetchAllRequests();
    } catch (err) {
      alert('Failed to update status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Assigned': return 'bg-blue-100 text-blue-800';
      case 'InProgress': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'All') return true;
    return req.status === filter;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Service Requests</h2>
      
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mr-2">Filter by status:</span>
        {['All', 'Pending', 'Assigned', 'InProgress', 'Completed'].map(status => (
          <button 
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 text-sm rounded-full mr-2 ${filter === status ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading && <p>Loading requests...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                {/* --- 1. NEW TABLE HEADER --- */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map(req => (
                <tr key={req._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                  {/* --- 2. NEW TABLE CELL TO DISPLAY SEVERITY --- */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(req.severity)}`}>
                      {req.severity || 'Low'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.category}</td>
                  <td className="px-6 py-4 max-w-sm text-sm text-gray-500 truncate">{req.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {req.status === 'Pending' && (
                      <button onClick={() => handleStatusChange(req._id, 'Assigned')} className="text-indigo-600 hover:text-indigo-900">Assign</button>
                    )}
                    {req.status === 'Assigned' && (
                      <button onClick={() => handleStatusChange(req._id, 'InProgress')} className="text-purple-600 hover:text-purple-900">Start Job</button>
                    )}
                     {req.status === 'InProgress' && (
                      <button onClick={() => handleStatusChange(req._id, 'Completed')} className="text-green-600 hover:text-green-900">Complete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && <p className="text-center p-4 text-gray-500">No requests match the current filter.</p>}
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;