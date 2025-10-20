import React, { useContext } from 'react';
import AuthContext from './context/authContext';
import AuthPage from './pages/authPage';
import UserDashboard from './pages/UserDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';

const MainApp = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Fix4Ever</h1>
            {user && <p className="text-xs text-gray-500">Logged in as {user.email} ({user.role})</p>}
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        {user?.role === 'Technician' ? <TechnicianDashboard /> : <UserDashboard />}
      </main>
    </div>
  );
};

function App() {
  const { user } = useContext(AuthContext);
  return <>{user ? <MainApp /> : <AuthPage />}</>;
}

export default App;