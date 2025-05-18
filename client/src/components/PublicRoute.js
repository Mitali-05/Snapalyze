// src/components/PublicRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  // Only redirect authenticated users away from login/register
  const restrictedToGuests = ['/','/login', '/register'];

  if (token && restrictedToGuests.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
