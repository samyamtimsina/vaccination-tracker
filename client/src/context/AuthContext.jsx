import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //automatic refresh token
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosClient.get('/api/users/me', { withCredentials: true });
        setUser(response.data.user);
        console.log('Auth check response:', response.data.user);
        console.log('logged in user', user)
      } catch (error) {
        // If access token expired, try refreshing
        try {
          await axiosClient.post('/api/auth/refresh', {}, { withCredentials: true });
          // Retry fetching user after refresh
          const retryResponse = await axiosClient.get('/api/users/me', { withCredentials: true });
          setUser(retryResponse.data.user);
        } catch {
          setUser(null); // Refresh failed → force logout
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Optional: auto-refresh every 10 minutes
    const interval = setInterval(async () => {
      try {
        await axiosClient.post('/api/auth/refresh', {}, { withCredentials: true });
      } catch {
        setUser(null); // Refresh failed → logout
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
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

      return response.data;
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
      value={{ user, setUser, login, logout, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
