import React, { useState } from 'react';
import {
  AppBar, Toolbar, Box, Button, Menu, MenuItem,
  Typography, IconButton, Avatar, Divider, Tooltip,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon        from '@mui/icons-material/Logout';
import LockIcon          from '@mui/icons-material/Lock';
import HomeIcon          from '@mui/icons-material/Home';
import logo              from '../logo.jpg';
import { useAuth }       from '../context/AuthContext';
import { BRAND }         from '../theme/theme';

export const HEADER_HEIGHT = 64;
export const CONTENT_MAX   = 1200;

function Header({ setActiveView }) {
  const { logout }  = useAuth();
  const location    = useLocation();
  const navigate    = useNavigate();
  const [anchor, setAnchor] = useState(null);

  const isLoggedIn  = Boolean(localStorage.getItem('token'));
  const isHome      = location.pathname === '/';
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isUpload    = location.pathname.startsWith('/upload');

  const handleLogout = () => {
    setAnchor(null);
    logout();
    navigate('/login', { replace: true });
  };

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const nb = (active) => ({
    color:        active ? BRAND.blue : BRAND.navy,
    fontWeight:   active ? 700 : 500,
    fontSize:     '0.875rem',
    borderRadius: 0,
    px: 1.5, py: 0.5,
    borderBottom: `2px solid ${active ? BRAND.blue : 'transparent'}`,
    transition:   'all 0.15s',
    '&:hover': { color: BRAND.blue, backgroundColor: 'transparent', borderBottomColor: BRAND.blueLight },
  });

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor:        'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom:   `1px solid ${BRAND.border}`,
          zIndex:         (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight:      `${HEADER_HEIGHT}px !important`,
            maxWidth:       CONTENT_MAX,
            width:          '100%',
            mx:             'auto',
            px:             { xs: 2, sm: 3, md: 4 },
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
          }}
        >
          {/* ── Logo — always links to / (landing page) ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img
                src={logo} alt="Snapalyze"
                style={{ height: 38, width: 'auto', marginRight: 10, objectFit: 'contain' }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800, letterSpacing: 0.3,
                  background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Snapalyze
              </Typography>
            </Link>
          </Box>

          {/* ── Center nav ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>

            {/* Public landing nav */}
            {isHome && !isLoggedIn && (
              <>
                <Button onClick={scrollTo('about')}    sx={nb(false)}>About</Button>
                <Button onClick={scrollTo('features')} sx={nb(false)}>Features</Button>
                <Button onClick={scrollTo('pricing')}  sx={nb(false)}>Pricing</Button>
              </>
            )}

            {/* Logged-in nav — Home always goes to landing page "/" */}
            {isLoggedIn && (isDashboard || isUpload || isHome) && (
              <>
                <Tooltip title="Go to landing page">
                  <Button
                    component={Link} to="/"
                    sx={nb(isHome)}
                    startIcon={<HomeIcon fontSize="small" />}
                  >
                    Home
                  </Button>
                </Tooltip>
                <Button
                  onClick={() => {
                    if (isDashboard) setActiveView?.('dashboard');
                    else navigate('/dashboard');
                  }}
                  sx={nb(isDashboard)}
                >
                  Dashboard
                </Button>
                <Button
                  component={Link} to="/upload"
                  sx={nb(isUpload)}
                >
                  Upload
                </Button>
                <Button
                  onClick={() => {
                    if (isDashboard) setActiveView?.('pricing');
                    else navigate('/dashboard');
                  }}
                  sx={nb(false)}
                >
                  Pricing
                </Button>
              </>
            )}
          </Box>

          {/* ── Right side ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            {/* Public home: sign in + register */}
            {!isLoggedIn && isHome && (
              <>
                <Button component={Link} to="/login" variant="text"
                  sx={{ color: BRAND.navy, fontWeight: 600 }}>
                  Sign In
                </Button>
                <Button component={Link} to="/register" variant="contained" sx={{ borderRadius: 8, px: 2 }}>
                  Get Started Free
                </Button>
              </>
            )}

            {/* Logged in: avatar dropdown */}
            {isLoggedIn && (isDashboard || isUpload || isHome) && (
              <>
                <Tooltip title="Account">
                  <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small">
                    <Avatar sx={{
                      width: 36, height: 36,
                      background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})`,
                      fontSize: 14, fontWeight: 700,
                    }}>
                      <AccountCircleIcon />
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchor}
                  open={Boolean(anchor)}
                  onClose={() => setAnchor(null)}
                  PaperProps={{
                    sx: {
                      borderRadius: 2, minWidth: 190,
                      boxShadow: '0 8px 32px rgba(13,46,63,0.15)',
                      border: `1px solid ${BRAND.border}`,
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => {
                    setAnchor(null);
                    if (isDashboard) setActiveView?.('profile');
                    else navigate('/dashboard');
                  }}>
                    <AccountCircleIcon fontSize="small" sx={{ mr: 1.5, color: BRAND.blue }} />
                    <Typography variant="body2" fontWeight={500}>Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    setAnchor(null);
                    if (isDashboard) setActiveView?.('changePassword');
                    else navigate('/dashboard');
                  }}>
                    <LockIcon fontSize="small" sx={{ mr: 1.5, color: BRAND.teal }} />
                    <Typography variant="body2" fontWeight={500}>Change Password</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
                    <Typography variant="body2" fontWeight={500} color="error.main">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer */}
      <Box sx={{ height: HEADER_HEIGHT }} />
    </>
  );
}

export default Header;