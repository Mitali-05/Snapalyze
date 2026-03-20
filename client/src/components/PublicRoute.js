import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const PublicRoute = ({ children }) => {
  const { token }  = useAuth();
  const location   = useLocation();

  // routes are blocked for authenticated users
  const authOnlyRoutes = ['/login', '/register'];

  if (token && authOnlyRoutes.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;