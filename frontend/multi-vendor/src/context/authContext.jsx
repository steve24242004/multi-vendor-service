import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // This effect runs only ONCE when the app first loads
  // Its job is to re-populate the state from localStorage if the user was already logged in.
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // IMPORTANT: Set the default auth header for all future axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []); // The empty array [] means this runs only on the initial render

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/users/login', {
      email,
      password,
    });

    // On successful login, update state and localStorage
    setToken(res.data.token);
    setUser(res.data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post('http://localhost:5000/api/users/register', {
      name,
      email,
      password,
    });

    // On successful registration, update state and localStorage
    setToken(res.data.token);
    setUser(res.data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

    return res.data;
  };

  const logout = () => {
    // Clear state and localStorage
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;