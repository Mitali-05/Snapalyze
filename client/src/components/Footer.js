import React from 'react';
import { Box, Grid, Typography, Link as MuiLink, Divider, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {
  return (
    <Box sx={{ backgroundColor: '#fff', mt: 8, px: { xs: 3, md: 10 }, py: 6 }}>
      <Grid container spacing={4}>
        {/* Logo */}
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 2 }}>
            <img src="/img/logo.svg" alt="TeamDesk Logo" style={{ height: 40 }} />
          </Box>
        </Grid>

        {/* About Links */}
        <Grid item xs={6} md={3}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#1a1a4b' }}>About</Typography>
          {['Home', 'How it works', 'Build your database', 'Pricing', 'Testimonials', 'Terms of service', 'Security and privacy'].map((text) => (
            <MuiLink key={text} href="#" underline="none" color="text.primary" display="block" sx={{ mb: 0.5 }}>
              {text}
            </MuiLink>
          ))}
        </Grid>

        {/* Help Links */}
        <Grid item xs={6} md={3}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#1a1a4b' }}>Help</Typography>
          {['Database library', 'Documentation', 'Getting started videos', 'Knowledge base & support', 'Find a TeamDesk Expert', 'Popular searches', 'System status', 'Blog'].map((text) => (
            <MuiLink key={text} href="#" underline="none" color="text.primary" display="block" sx={{ mb: 0.5 }}>
              {text}
            </MuiLink>
          ))}
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      {/* Bottom copyright and social icons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Copyright 2025 ForeSoft Corporation. All Rights Reserved.
        </Typography>
        <Box>
          <IconButton sx={{ border: '1px solid #e0e0e0', mr: 1 }}>
            <TwitterIcon />
          </IconButton>
          <IconButton sx={{ border: '1px solid #e0e0e0', mr: 1 }}>
            <FacebookIcon />
          </IconButton>
          <IconButton sx={{ border: '1px solid #e0e0e0' }}>
            <LinkedInIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
