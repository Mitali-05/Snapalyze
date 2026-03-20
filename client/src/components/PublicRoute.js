import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicRoute
 *
 * FIX: Only redirect logged-in users away from /login and /register.
 * The landing page "/" is now always accessible — logged-in users can
 * visit it by clicking "Home" in the header.
 */
const PublicRoute = ({ children }) => {
  const { token }  = useAuth();
  const location   = useLocation();

  // Only these two routes are blocked for authenticated users
  const authOnlyRoutes = ['/login', '/register'];

  if (token && authOnlyRoutes.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;