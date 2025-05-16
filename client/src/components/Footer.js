import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Link as MuiLink,
  Divider,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {
  const aboutLinks = [
    { text: 'Home', href: '#' },
    { text: 'How it works', href: '#' },
    { text: 'Build your database', href: '#' },
    { text: 'Pricing', href: '#pricing' },
    { text: 'Testimonials', href: '#' },
    { text: 'Terms of service', href: '#' },
    { text: 'Security and privacy', href: '#' },
  ];

  const helpLinks = [
    'Database library',
    'Documentation',
    'Getting started videos',
    'Knowledge base & support',
    'Find a TeamDesk Expert',
    'Popular searches',
    'System status',
    'Blog',
  ];

  return (
    
    <Box sx={{ backgroundColor: '#fff', mt: 8, px: { xs: 3, md: 12 }, py: 6 }}>
      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      <Grid container spacing={4} justifyContent="space-between">
        {/* About Links */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#1a1a4b' }}>
            About
          </Typography>
          {aboutLinks.map(({ text, href }) => (
            <MuiLink
              key={text}
              href={href}
              underline="none"
              color="text.primary"
              display="block"
              sx={{ mb: 1 }}
            >
              {text}
            </MuiLink>
          ))}
        </Grid>

        {/* Help Links */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#1a1a4b' }}>
            Help
          </Typography>
          {helpLinks.map((text) => (
            <MuiLink
              key={text}
              href="#"
              underline="none"
              color="text.primary"
              display="block"
              sx={{ mb: 1 }}
            >
              {text}
            </MuiLink>
          ))}
        </Grid>

        {/* Newsletter Subscription */}
        <Grid item xs={12} md={4}>
          <Box sx={{ ml: { md: 'auto' }, maxWidth: 360 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#1a1a4b' }}>
              Subscribe to our Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Get the latest updates, tips, and insights delivered to your inbox.
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Your email address"
                variant="outlined"
                size="small"
                fullWidth
              />
              <Button variant="contained" color="primary">
                Subscribe
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      {/* Bottom section */}
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
          © 2025 Alpha Corporation. All Rights Reserved.
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
