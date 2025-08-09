import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthentication = async () => {
    try {
      const response = await axiosClient.get('/api/auth/me', {
        withCredentials: true,
      });
      setUser(response.data.user); // The server should return the user's data
    } catch (error) {
      console.error('Authentication check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run the check when the component first mounts.
  useEffect(() => {
    checkAuthentication();
  }, []);

  async function login(email, password) {
    try {
      setLoading(true);
      const response = await axiosClient.post(
        '/api/auth/login',
        { email, password },
        { withCredentials: true },
      );
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Propagate the error for the component to handle
    } finally {
      setLoading(false);
    }
  }

  // Logout function must now make an API call to clear the cookie.
  async function logout() {
    try {
      // Tell the server to clear the httpOnly cookie.
      await axiosClient.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
