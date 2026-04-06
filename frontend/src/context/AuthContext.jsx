import { useMemo, useState } from 'react';
import { AuthContext } from './authContextObject';
import { authApi } from '../services/api';
import { MOCK_USERS } from '../services/mockData';

const getStoredUser = () => {
  const savedUser = localStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null;
};


const getLocalUsers = () => {
  const saved = localStorage.getItem('mockUsers');
  return saved ? JSON.parse(saved) : MOCK_USERS;
};

const setLocalUsers = (users) => {
  localStorage.setItem('mockUsers', JSON.stringify(users));
};

const isNetworkError = (err) => !err?.response;

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
    } catch (err) {
      if (!isNetworkError(err)) throw err;

      const users = getLocalUsers();
      const fallbackUser = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());

      if (!fallbackUser || fallbackUser.password !== credentials.password) {
        throw new Error('Invalid credentials for offline mode');
      }

      if (credentials.role && fallbackUser.role !== credentials.role) {
        throw new Error('Selected role does not match your account role');
      }

      const { password: _password, ...safeUser } = fallbackUser;
      setUser(safeUser);
      localStorage.setItem('user', JSON.stringify(safeUser));
      localStorage.setItem('token', 'offline-token');
      return safeUser;
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
    } catch (err) {
      if (!isNetworkError(err)) throw err;

      const users = getLocalUsers();
      const existing = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
      if (existing) throw new Error('Email already exists');

      const offlineUser = {
        id: `U-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        role: payload.role || 'borrower',
        password: payload.password,
      };

      const nextUsers = [...users, offlineUser];
      setLocalUsers(nextUsers);

      const { password: _password, ...safeUser } = offlineUser;
      setUser(safeUser);
      localStorage.setItem('user', JSON.stringify(safeUser));
      localStorage.setItem('token', 'offline-token');
      return safeUser;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({ user, loading, login, logout, register }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
