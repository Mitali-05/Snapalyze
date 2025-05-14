import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

function Section({ title = '', content = '', icon = null }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        mb: 4,
        borderRadius: 4,
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 24px rgba(149, 157, 165, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        {icon && <Box sx={{ fontSize: 40 }}>{icon}</Box>}
        {title && (
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: 700, color: '#1a1a4b' }}
          >
            {title}
          </Typography>
        )}
      </Box>
      {content && (
        <Typography variant="body1" sx={{ color: '#333', fontSize: '1.1rem' }}>
          {content}
        </Typography>
      )}
    </Paper>
  );
}

export default Section;
