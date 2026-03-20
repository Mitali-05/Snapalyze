import React from 'react';
import { Box } from '@mui/material';
import { BRAND } from '../theme/theme';

const PageWrapper = ({ children, sx = {} }) => (
  <Box
    sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at 0% 0%,   rgba(30,123,196,0.07) 0%, transparent 55%),
        radial-gradient(ellipse at 100% 0%,  rgba(74,140,63,0.06)  0%, transparent 55%),
        radial-gradient(ellipse at 50% 100%, rgba(26,107,107,0.05) 0%, transparent 55%),
        ${BRAND.bg}
      `,
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default PageWrapper;