import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

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
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem('token');
    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      const response = await apiService.auth.getProfile();
      setUser(response.data.user);
      setError(null);
    } catch (error) {
      console.error('Token validation failed:', error);
      // Token is invalid, remove it
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await apiService.auth.login({ email, password });
      
      const { user, token } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Set user
      setUser(user);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await apiService.auth.register(userData);
      
      const { user, token } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Set user
      setUser(user);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await apiService.auth.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Remove token and user regardless of API call success
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await apiService.auth.updateProfile(profileData);
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setError(null);
      await apiService.auth.changePassword(passwordData);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isSuperAdmin = () => user?.role === 'admin' && user?.adminType === 'super';
  const isDepartmentAdmin = () => user?.role === 'admin' && user?.adminType === 'department';
  const isUser = () => user?.role === 'user';
  const isAuthenticated = () => !!user;

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAdmin,
    isSuperAdmin,
    isDepartmentAdmin,
    isUser,
    isAuthenticated,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
