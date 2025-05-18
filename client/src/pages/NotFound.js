// src/pages/NotFound.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h3" color="error">404 - Page Not Found</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        The page you are looking for does not exist.
      </Typography>
    </Box>
  );
}

export default NotFound;
