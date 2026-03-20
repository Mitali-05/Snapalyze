import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Paper, Typography, TextField, Button, InputAdornment,
  LinearProgress, MenuItem, Select, InputLabel, FormControl,
  Alert, CircularProgress, Divider,
} from '@mui/material';
import { Person, Email, Lock, Work, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { BRAND }   from '../theme/theme';
import logo        from '../logo.jpg';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const RULES = [
  { test: (p) => p.length >= 8,                     label: '8+ chars' },
  { test: (p) => /[A-Z]/.test(p),                   label: 'Uppercase' },
  { test: (p) => /[a-z]/.test(p),                   label: 'Lowercase' },
  { test: (p) => /\d/.test(p),                      label: 'Number' },
  { test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), label: 'Special char' },
];

const getStrength = (pw) => {
  const n = RULES.filter((r) => r.test(pw)).length;
  if (n <= 2) return { label: 'Weak',   color: 'error',   pct: 33 };
  if (n <= 4) return { label: 'Medium', color: 'warning', pct: 66 };
  return              { label: 'Strong', color: 'success', pct: 100 };
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    confirmPassword: '', profession: '', organization: '', role: 'user',
  });
  const [showPwd,    setShowPwd]    = useState(false);
  const [showCon,    setShowCon]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [apiErrors,  setApiErrors]  = useState([]);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setApiErrors([]); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setApiErrors([]);
    const unmet = RULES.filter((r) => !r.test(form.password)).map((r) => r.label);
    if (unmet.length) { setApiErrors([`Password needs: ${unmet.join(', ')}`]); return; }
    if (form.password !== form.confirmPassword) { setApiErrors(['Passwords do not match']); return; }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/users/register`, form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setApiErrors(err.response?.data?.errors?.map((e) => e.msg) || [err.response?.data?.message || 'Registration failed.']);
    } finally { setLoading(false); }
  };

  const str = form.password ? getStrength(form.password) : null;

  return (
    <PageWrapper sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, width: 380, flexShrink: 0,
        background: `linear-gradient(160deg, ${BRAND.navy} 0%, ${BRAND.teal} 100%)`,
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 5, gap: 3,
      }}>
        <img src={logo} alt="Snapalyze" style={{ width: 90 }} />
        <Typography variant="h5" fontWeight={800} color="#fff" textAlign="center">Join Snapalyze</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)', textAlign: 'center', lineHeight: 1.7 }}>
          Free plan includes 2 uploads per day.<br />No credit card required.
        </Typography>
        <Box sx={{ width: '100%', borderRadius: 2, background: 'rgba(255,255,255,0.1)', p: 2 }}>
          {['✓  AI image classification', '✓  OCR text extraction', '✓  Visual insights dashboard', '✓  Secure cloud storage'].map((f) => (
            <Typography key={f} variant="body2" sx={{ color: 'rgba(255,255,255,0.82)', mb: 0.75 }}>{f}</Typography>
          ))}
        </Box>
      </Box>

      {/* Right form */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, sm: 4 }, py: 6 }}>
        <Paper elevation={0} sx={{
          p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 460,
          borderRadius: 4, border: `1px solid ${BRAND.border}`,
          boxShadow: '0 8px 40px rgba(13,46,63,0.09)',
        }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={800} sx={{
              background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 0.5,
            }}>Create Account</Typography>
            <Typography variant="body2" color="text.secondary">Free forever · No credit card</Typography>
          </Box>

          {apiErrors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiErrors.map((m, i) => <div key={i}>{m}</div>)}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField fullWidth label="First Name" name="firstName" required value={form.firstName} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ fontSize: 18, color: BRAND.blue }} /></InputAdornment> }} />
              <TextField fullWidth label="Last Name" name="lastName" required value={form.lastName} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ fontSize: 18, color: BRAND.blue }} /></InputAdornment> }} />
            </Box>

            <TextField fullWidth label="Email" name="email" type="email" required value={form.email} onChange={handleChange} sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: BRAND.blue }} /></InputAdornment> }} />

            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel>Profession</InputLabel>
              <Select label="Profession" name="profession" value={form.profession} onChange={handleChange}>
                {['unemployed','student','employee','freelancer','entrepreneur','other'].map((p) => (
                  <MenuItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField fullWidth label="Organization (optional)" name="organization" value={form.organization} onChange={handleChange} sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Work sx={{ fontSize: 18, color: BRAND.blue }} /></InputAdornment> }} />

            <TextField
              fullWidth label="Password" name="password" type={showPwd ? 'text' : 'password'} required
              value={form.password} onChange={handleChange} sx={{ mb: 1 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: BRAND.blue }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><Box component="span" onClick={() => setShowPwd(!showPwd)} sx={{ cursor: 'pointer', display: 'flex', color: 'text.secondary' }}>{showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</Box></InputAdornment>,
              }}
            />

            {str && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color={`${str.color}.main`} fontWeight={700}>{str.label}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={str.pct} color={str.color} sx={{ height: 5, mb: 1 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {RULES.map((rule) => (
                    <Typography key={rule.label} variant="caption"
                      sx={{ color: rule.test(form.password) ? BRAND.teal : 'text.disabled', fontWeight: rule.test(form.password) ? 600 : 400 }}>
                      {rule.test(form.password) ? '✓' : '○'} {rule.label}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            <TextField
              fullWidth label="Confirm Password" name="confirmPassword" type={showCon ? 'text' : 'password'} required
              value={form.confirmPassword} onChange={handleChange}
              error={form.confirmPassword.length > 0 && form.password !== form.confirmPassword}
              helperText={form.confirmPassword.length > 0 && form.password !== form.confirmPassword ? 'Passwords do not match' : ''}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: BRAND.blue }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><Box component="span" onClick={() => setShowCon(!showCon)} sx={{ cursor: 'pointer', display: 'flex', color: 'text.secondary' }}>{showCon ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</Box></InputAdornment>,
              }}
            />

            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ py: 1.5, mb: 2 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}><Typography variant="caption" color="text.secondary">or</Typography></Divider>
          <Typography align="center" variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Typography component={Link} to="/login" variant="body2"
              sx={{ color: BRAND.blue, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign in
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </PageWrapper>
  );
}