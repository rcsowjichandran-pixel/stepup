import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('stepup_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('stepup_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      api.getCurrentUser(token)
        .then(u => {
          setUser(u);
          localStorage.setItem('stepup_user', JSON.stringify(u));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      const accessToken = data.tokens?.access || 'mock-token';
      setToken(accessToken);
      setUser(data.user);
      localStorage.setItem('stepup_token', accessToken);
      localStorage.setItem('stepup_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await api.register(userData);
      const accessToken = data.tokens?.access || 'mock-token';
      setToken(accessToken);
      setUser(data.user);
      localStorage.setItem('stepup_token', accessToken);
      localStorage.setItem('stepup_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('stepup_token');
    localStorage.removeItem('stepup_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
