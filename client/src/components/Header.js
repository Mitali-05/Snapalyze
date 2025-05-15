import React from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 4px 24px rgba(149, 157, 165, 0.2)',
        paddingY: 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          maxWidth: '1200px',
          marginX: 'auto',
          width: '100%',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/img/logo.svg"
              alt="Snapalyze Logo"
              style={{ height: 40, marginRight: 8 }}
            />
          </Link>
        </Box>

        {/* Center Navigation */}
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#2b2b4f',
          }}
        >
          <Link to="/about-us" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</Link>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Our Products</Link>
          <Link to="/Pricing_to" style={{ textDecoration: 'none', color: 'inherit' }}>Pricing</Link>
        </Box>

        {/* Login & Get Started Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={Link}
            to="/login"
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#2b2b4f',
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: '999px',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/get-started"
            endIcon={<ArrowForwardIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              color: '#f14156',
              backgroundColor: '#ffffff',
              borderRadius: '999px',
              border: '2px solid #f14156',
              paddingX: 3,
              '&:hover': {
                backgroundColor: '#fff0f0',
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
