import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  localStorage.setItem('token', data.token);

  // Fetch the full user to guarantee all fields are present
  const meRes = await api.get('/auth/me');
  setUser(meRes.data.user);
  return data;
  };


  const login = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  localStorage.setItem('token', data.token);

  // Fetch the full user to guarantee all fields are present
  const meRes = await api.get('/auth/me');
  setUser(meRes.data.user);
  return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const refreshUser = async () => {
  const { data } = await api.get('/auth/me');
  setUser(data.user);
  return data.user;
};

const updateUser = (nextUser) => setUser(nextUser);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);