import { useMemo, useState } from 'react';
import { AuthContext } from './authContextObject';
import { authApi } from '../services/api';

const getStoredUser = () => {
  const savedUser = localStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { user: nextUser, token } = await authApi.login(credentials);
      setUser(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
      localStorage.setItem('token', token);
      return nextUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { user: nextUser, token } = await authApi.register(payload);
      setUser(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
      localStorage.setItem('token', token);
      return nextUser;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({ user, loading, login, logout, register }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
