import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Paper, Typography, TextField, Button,
  InputAdornment, Alert, CircularProgress, LinearProgress,
} from '@mui/material';
import { Lock, CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { BRAND }   from '../theme/theme';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const RULES = [
  { test: (p) => p.length >= 8,                     label: '8+ characters' },
  { test: (p) => /[A-Z]/.test(p),                   label: 'Uppercase letter' },
  { test: (p) => /[a-z]/.test(p),                   label: 'Lowercase letter' },
  { test: (p) => /\d/.test(p),                      label: 'Number' },
  { test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), label: 'Special character' },
];

const getStrength = (pw) => {
  const n = RULES.filter((r) => r.test(pw)).length;
  if (n <= 2) return { label: 'Weak',   color: 'error',   pct: 33 };
  if (n <= 4) return { label: 'Medium', color: 'warning', pct: 66 };
  return              { label: 'Strong', color: 'success', pct: 100 };
};

export default function ResetPassword() {
  const { token }  = useParams();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPwd,  setShowPwd]  = useState(false);
  const [showCon,  setShowCon]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [errors,   setErrors]   = useState([]);

  const str = form.password ? getStrength(form.password) : null;

  const handleSubmit = async (e) => {
    e.preventDefault(); setErrors([]);
    const unmet = RULES.filter((r) => !r.test(form.password)).map((r) => r.label);
    if (unmet.length) { setErrors([`Password needs: ${unmet.join(', ')}`]); return; }
    if (form.password !== form.confirmPassword) { setErrors(['Passwords do not match']); return; }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/users/reset-password/${token}`, form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setErrors(err.response?.data?.errors?.map((e) => e.msg) || [err.response?.data?.message || 'Something went wrong.']);
    } finally { setLoading(false); }
  };

  return (
    <PageWrapper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', px: 2 }}>
      <Paper elevation={0} sx={{
        p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 440, borderRadius: 4,
        border: `1px solid ${BRAND.border}`, boxShadow: '0 8px 40px rgba(13,46,63,0.09)',
      }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{
            width: 60, height: 60, borderRadius: 3, mx: 'auto', mb: 2,
            background: `linear-gradient(135deg, ${BRAND.green}, ${BRAND.teal})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} color={BRAND.navy}>Set New Password</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Must meet all strength requirements below.
          </Typography>
        </Box>

        {success ? (
          <Alert icon={<CheckCircle />} severity="success" sx={{ borderRadius: 2 }}>
            <Typography fontWeight={600}>Password reset successfully!</Typography>
            <Typography variant="body2">Redirecting to login in 3 seconds…</Typography>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            {errors.length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.map((e, i) => <div key={i}>{e}</div>)}
              </Alert>
            )}

            <TextField
              fullWidth label="New Password" type={showPwd ? 'text' : 'password'} required
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ color: BRAND.blue, fontSize: 18 }} /></InputAdornment>,
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
              fullWidth label="Confirm Password" type={showCon ? 'text' : 'password'} required
              value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={form.confirmPassword.length > 0 && form.password !== form.confirmPassword}
              helperText={form.confirmPassword.length > 0 && form.password !== form.confirmPassword ? 'Passwords do not match' : ''}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ color: BRAND.blue, fontSize: 18 }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><Box component="span" onClick={() => setShowCon(!showCon)} sx={{ cursor: 'pointer', display: 'flex', color: 'text.secondary' }}>{showCon ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</Box></InputAdornment>,
              }}
            />

            <Button type="submit" variant="contained" fullWidth size="large"
              disabled={loading} sx={{ py: 1.5 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Reset Password'}
            </Button>
          </form>
        )}
      </Paper>
    </PageWrapper>
  );
}