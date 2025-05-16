import React from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import logo from '../logo.jpg';

function Header() {
  // Scroll to element by id with smooth behavior
  const handleScroll = (id) => (event) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppBar
      position="sticky"
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
          alignItems: 'center',
          width: '100%',
          px: { xs: 4, sm: 6, md: 8, lg: 10 }, // responsive horizontal padding
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src={logo}
              alt="Snapalyze logo"
              style={{
                height: 60,
                width: 'auto',
                marginRight: 12,
                objectFit: 'contain',
              }}
            />
            <span
              style={{
                fontWeight: 'bold',
                fontSize: 28,
                background: 'linear-gradient(90deg, #f14156, #2b2b4f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                letterSpacing: 1,
              }}
            >
              Snapalyze
            </span>
          </Link>
        </Box>

        {/* Center Navigation - scroll to IDs */}
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
          <a
            href="#about"
            onClick={handleScroll('about')}
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            About Us
          </a>
          <a
            href="#features"
            onClick={handleScroll('features')}
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={handleScroll('pricing')}
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            Pricing
          </a>
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
            to="/register"
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
