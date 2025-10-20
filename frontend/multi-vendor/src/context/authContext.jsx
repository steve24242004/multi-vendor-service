import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/users/login', {
      email,
      password,
    });

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

    setToken(res.data.token);
    setUser(res.data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

    return res.data;
  };

  const logout = () => {
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