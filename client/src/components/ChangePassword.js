import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, TextField, Button, InputAdornment,
  Alert, LinearProgress, CircularProgress, Collapse,
  Divider, Link as MuiLink,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff, LockReset } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { BRAND } from '../theme/theme';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const RULES = [
  { test: (p) => p.length >= 8,                         label: '8+ characters' },
  { test: (p) => /[A-Z]/.test(p),                       label: 'Uppercase letter' },
  { test: (p) => /[a-z]/.test(p),                       label: 'Lowercase letter' },
  { test: (p) => /\d/.test(p),                          label: 'Number' },
  { test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),     label: 'Special character' },
];

const strength = (pw) => {
  const n = RULES.filter((r) => r.test(pw)).length;
  if (n <= 2) return { label: 'Weak',   color: 'error',   pct: 33 };
  if (n <= 4) return { label: 'Medium', color: 'warning', pct: 66 };
  return              { label: 'Strong', color: 'success', pct: 100 };
};

const EyeToggle = ({ show, onToggle }) => (
  <InputAdornment position="end">
    <Box component="span" onClick={onToggle}
      sx={{ cursor: 'pointer', display: 'flex', color: 'text.secondary', '&:hover': { color: BRAND.blue } }}>
      {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
    </Box>
  </InputAdornment>
);

function ChangePassword({ onSuccess }) {
  const [form, setForm]   = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [show, setShow]   = useState({ cur: false, nw: false, cnf: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors,  setErrors]  = useState([]);

  const str = form.newPassword ? strength(form.newPassword) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]); setSuccess('');
    const unmet = RULES.filter((r) => !r.test(form.newPassword)).map((r) => r.label);
    if (unmet.length) { setErrors([`Password must include: ${unmet.join(', ')}`]); return; }
    if (form.newPassword !== form.confirmNewPassword) { setErrors(['New passwords do not match']); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/users/change-password`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      onSuccess?.();
    } catch (err) {
      setErrors([err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to change password.']);
    } finally { setLoading(false); }
  };

  return (
    <Box>
      {/* Section header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 2,
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LockReset sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color={BRAND.navy}>Change Password</Typography>
          <Typography variant="caption" color="text.secondary">Update your account security</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Collapse in={errors.length > 0}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </Alert>
      </Collapse>
      <Collapse in={Boolean(success)}>
        <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
      </Collapse>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth label="Current Password"
          type={show.cur ? 'text' : 'password'}
          required value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Lock sx={{ color: BRAND.blue, fontSize: 18 }} /></InputAdornment>,
            endAdornment: <EyeToggle show={show.cur} onToggle={() => setShow({ ...show, cur: !show.cur })} />,
          }}
        />

        <TextField
          fullWidth label="New Password"
          type={show.nw ? 'text' : 'password'}
          required value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          sx={{ mb: 1 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Lock sx={{ color: BRAND.blue, fontSize: 18 }} /></InputAdornment>,
            endAdornment: <EyeToggle show={show.nw} onToggle={() => setShow({ ...show, nw: !show.nw })} />,
          }}
        />

        {/* Strength bar + inline rule checklist */}
        {str && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color={`${str.color}.main`} fontWeight={700}>
                {str.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {RULES.filter((r) => r.test(form.newPassword)).length}/{RULES.length} rules met
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={str.pct} color={str.color} sx={{ height: 5, mb: 1 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {RULES.map((rule) => (
                <Typography
                  key={rule.label} variant="caption"
                  sx={{
                    color: rule.test(form.newPassword) ? BRAND.teal : 'text.disabled',
                    fontWeight: rule.test(form.newPassword) ? 600 : 400,
                  }}
                >
                  {rule.test(form.newPassword) ? '✓' : '○'} {rule.label}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        <TextField
          fullWidth label="Confirm New Password"
          type={show.cnf ? 'text' : 'password'}
          required value={form.confirmNewPassword}
          onChange={(e) => setForm({ ...form, confirmNewPassword: e.target.value })}
          error={form.confirmNewPassword.length > 0 && form.newPassword !== form.confirmNewPassword}
          helperText={
            form.confirmNewPassword.length > 0 && form.newPassword !== form.confirmNewPassword
              ? '✗ Passwords do not match' : ''
          }
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Lock sx={{ color: BRAND.blue, fontSize: 18 }} /></InputAdornment>,
            endAdornment: <EyeToggle show={show.cnf} onToggle={() => setShow({ ...show, cnf: !show.cnf })} />,
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Button
            type="submit" variant="contained" size="large"
            disabled={loading} sx={{ px: 4 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Update Password'}
          </Button>

          {/* Forgot password shortcut */}
          <Typography variant="body2" color="text.secondary">
            Forgot your current password?{' '}
            <MuiLink
              component={Link} to="/forgot-password"
              sx={{ color: BRAND.blue, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Reset it here
            </MuiLink>
          </Typography>
        </Box>
      </form>
    </Box>
  );
}

export default ChangePassword;