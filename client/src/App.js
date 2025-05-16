import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import AnalyzeText from './pages/AnalyzeText';
import TextExtraction from './pages/TextExtraction';
import ClassifyImages from './pages/ClassifyImages';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes (Redirect to /dashboard if logged in) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyze-text"
          element={
            <ProtectedRoute>
              <AnalyzeText />
            </ProtectedRoute>
          }
        />
        <Route
          path="/text-extraction"
          element={
            <ProtectedRoute>
              <TextExtraction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classify-images"
          element={
            <ProtectedRoute>
              <ClassifyImages />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
