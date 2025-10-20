import React, { useState } from 'react';
import ServiceRequestForm from '../components/serviceRequestForm';
import RequestList from '../components/requestList';

const UserDashboard = () => {
  // This state is used to trigger a refresh of the RequestList
  // when a new request is created in the form.
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewRequest = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger effect
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <ServiceRequestForm onNewRequest={handleNewRequest} />
      </div>
      <div className="md:col-span-2">
        <RequestList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default UserDashboard;