import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStoredToken = () => localStorage.getItem('token');

  const normalizeRole = (role) => {
    if (!role) return null;
    return String(role).replace(/^ROLE_/, '').toUpperCase();
  };

  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  const buildUserFromAuth = (token, userData) => {
    const normalizedRole = normalizeRole(userData?.role || userData);
    let email = userData?.email || '';

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        email = email || payload.sub || '';
      } catch (error) {
        console.error('Error parsing token payload:', error);
      }
    }

    return {
      ...userData,
      email,
      role: normalizedRole,
      name: userData?.name || email || 'Customer',
    };
  };

  useEffect(() => {
    // Check for existing token and user on app load
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser && !isTokenExpired(token)) {
      try {
        setUser(buildUserFromAuth(token, JSON.parse(savedUser)));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else if (token || savedUser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: responseUser, role } = response.data;
      const userData = buildUserFromAuth(token, responseUser || { email, role });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, phone, address) => {
    try {
      await authAPI.register({
        name, 
        email, 
        password, 
        phone, 
        address 
      });

      return await login(email, password);
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const refreshUser = () => {
    const token = getStoredToken();
    const savedUser = localStorage.getItem('user');

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return;
    }

    if (savedUser) {
      try {
        setUser(buildUserFromAuth(token, JSON.parse(savedUser)));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user && !!getStoredToken() && !isTokenExpired(getStoredToken()),
    isAdmin: normalizeRole(user?.role) === 'ADMIN',
    isSeller: normalizeRole(user?.role) === 'SELLER',
    isUser: normalizeRole(user?.role) === 'USER',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
