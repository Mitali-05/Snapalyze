import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (storedToken) setToken(storedToken);
    if (storedUserId) setUserId(storedUserId);
    setLoading(false);
  }, []);

  const login = (newToken, newUserId) => {
    if (!newToken || !newUserId) {
      console.warn('login called without token or userId');
      return;
    }
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', newUserId);
    setToken(newToken);
    setUserId(newUserId);
  };

  const logout = (onLogoutRedirect) => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);

    // Let the caller handle the redirect
    if (onLogoutRedirect && typeof onLogoutRedirect === 'function') {
      onLogoutRedirect();
    }
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{ token, userId, isAuthenticated, login, logout, loading, setUserId }}
    >
      {children}
    </AuthContext.Provider>
  );
};
