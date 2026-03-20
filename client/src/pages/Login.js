import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Paper, Typography, TextField, Button,
  InputAdornment, CircularProgress, Alert, Divider,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth }    from '../context/AuthContext';
import PageWrapper    from '../components/PageWrapper';
import { BRAND }      from '../theme/theme';
import logo           from '../logo.jpg';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, form);
      login(res.data.token, res.data.userId);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <PageWrapper sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Left decorative panel ── */}
      <Box sx={{
        display:        { xs: 'none', md: 'flex' },
        width:          420,
        flexShrink:     0,
        background:     `linear-gradient(160deg, ${BRAND.navy} 0%, ${BRAND.navyLight} 40%, ${BRAND.teal} 100%)`,
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        px: 5, gap: 4,
      }}>
        <img src={logo} alt="Snapalyze" style={{ width: 110, filter: 'brightness(1.1)' }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={800} color="#fff" gutterBottom>
            Snapalyze
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            AI-powered image analysis.<br />Classify, extract text, and uncover insights instantly.
          </Typography>
        </Box>
        <Box sx={{
          width: '100%', borderRadius: 3,
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.12)',
          p: 2.5,
        }}>
          {['🔍  Analyze images with AI', '📝  Extract text via OCR', '📊  Visualize data insights', '🔒  Secure & private'].map((f) => (
            <Typography key={f} variant="body2" sx={{ color: 'rgba(255,255,255,0.82)', mb: 1, '&:last-child': { mb: 0 } }}>{f}</Typography>
          ))}
        </Box>
      </Box>

      {/* ── Right form panel ── */}
      <Box sx={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        px: { xs: 2, sm: 4 }, py: 6,
      }}>
        <Paper elevation={0} sx={{
          p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420,
          borderRadius: 4, border: `1px solid ${BRAND.border}`,
          boxShadow: '0 8px 40px rgba(13,46,63,0.10)',
        }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={800} sx={{
              background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 0.5,
            }}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your Snapalyze account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email address" name="email" type="email" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: BRAND.blue, fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Password" name="password"
              type={showPwd ? 'text' : 'password'} required
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ color: BRAND.blue, fontSize: 20 }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <Box component="span" onClick={() => setShowPwd(!showPwd)}
                      sx={{ cursor: 'pointer', display: 'flex', color: 'text.secondary' }}>
                      {showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Typography component={Link} to="/forgot-password" variant="body2"
                sx={{ color: BRAND.blue, textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
                Forgot password?
              </Typography>
            </Box>
            <Button type="submit" variant="contained" fullWidth size="large"
              disabled={loading} sx={{ py: 1.5, mb: 2 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}><Typography variant="caption" color="text.secondary">or</Typography></Divider>
          <Typography align="center" variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Typography component={Link} to="/register" variant="body2"
              sx={{ color: BRAND.blue, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Create one free
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </PageWrapper>
  );
}