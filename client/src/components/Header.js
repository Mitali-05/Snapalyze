import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../logo.jpg';
import { useAuth } from '../context/AuthContext';

function Header({ setActiveView, quotaFull }) {  // <-- receive quotaFull prop
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileClose();
    navigate('/login', { replace: true });
  };

  const handleScroll = (id) => (event) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUploadClick = (e) => {
    if (quotaFull) {
      e.preventDefault();
      alert('Upload quota exceeded. Please upgrade your plan or wait until your quota resets.');
      return;
    }
    // otherwise, proceed normally (Link will handle navigation)
  };

  const isHome = location.pathname === '/';
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isUpload = location.pathname.startsWith('/upload');

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
          px: { xs: 4, sm: 6, md: 8, lg: 10 },
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <img
              src={logo}
              alt="Snapalyze logo"
              style={{ height: 60, width: 'auto', marginRight: 12, objectFit: 'contain' }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #f14156, #2b2b4f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: 1,
              }}
            >
              Snapalyze
            </Typography>
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
          {isHome && (
            <>
              <Button onClick={handleScroll('about')} sx={{ color: 'inherit', textTransform: 'none' }}>
                About Us
              </Button>
              <Button onClick={handleScroll('features')} sx={{ color: 'inherit', textTransform: 'none' }}>
                Features
              </Button>
              <Button
                onClick={(e) => {
                  if (isHome) {
                    handleScroll('pricing')(e);
                  } else if (isDashboard && setActiveView) {
                    setActiveView('pricing');
                  }
                }}
                sx={{ color: 'inherit', textTransform: 'none' }}
              >
                Pricing
              </Button>
            </>
          )}

          {isDashboard && (
            <>
              <Button
                onClick={() => {
                  if (setActiveView) setActiveView('dashboard');
                }}
                sx={{ color: 'inherit', textTransform: 'none' }}
              >
                Dashboard
              </Button>

              {/* Upload button disabled or blocked if quotaFull */}
              <Button
                component={Link}
                to={quotaFull ? '#' : '/upload'}
                onClick={handleUploadClick}
                sx={{
                  color: quotaFull ? 'gray' : 'inherit',
                  textTransform: 'none',
                  pointerEvents: quotaFull ? 'none' : 'auto', // disable click if full
                }}
              >
                Upload a Zip
              </Button>

              <Button
                onClick={() => {
                  if (setActiveView) setActiveView('pricing');
                }}
                sx={{ color: 'inherit', textTransform: 'none' }}
              >
                Pricing
              </Button>
            </>
          )}

          {isUpload && <></>}
        </Box>

        {/* Right Side Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isLoggedIn && isHome && (
            <>
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
                  '&:hover': { backgroundColor: '#f5f5f5' },
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
                  '&:hover': { backgroundColor: '#fff0f0' },
                }}
              >
                Get Started
              </Button>
            </>
          )}

          {isLoggedIn && (isDashboard || isUpload) && (
            <>
              <IconButton
                onClick={handleProfileClick}
                size="large"
                color="inherit"
                aria-controls={open ? 'profile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <AccountCircleIcon sx={{ color: '#2b2b4f', fontSize: 32 }} />
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleProfileClose}
                MenuListProps={{ 'aria-labelledby': 'profile-button' }}
              >
                <MenuItem
                  onClick={() => {
                    handleProfileClose();
                    if (setActiveView) setActiveView('profile');
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
