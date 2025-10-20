import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Configure axios to always send the token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      // Fetch user data if we have a token but no user object
      if (!user) {
        // You would typically have a '/api/users/profile' endpoint to get user data
        // For now, we'll decode it from the token (less secure, but okay for this prototype)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({ _id: payload.id }); // Simplified user object
        } catch (e) {
            console.error("Invalid token:", e);
            logout();
        }
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token, user]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });
      setToken(res.data.token);
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : new Error('Something went wrong');
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password,
      });
      setToken(res.data.token);
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : new Error('Something went wrong');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
