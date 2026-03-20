import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Paper, Typography, TextField, Button,
  InputAdornment, Alert, CircularProgress,
} from '@mui/material';
import { Email, ArrowBack, CheckCircle, Refresh } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { BRAND }   from '../theme/theme';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ForgotPassword() {
  const [email,      setEmail]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [sent,       setSent]       = useState(false);
  const [resending,  setResending]  = useState(false);
  const [resendMsg,  setResendMsg]  = useState('');
  const [error,      setError]      = useState('');

  const sendRequest = async (isResend = false) => {
    setError('');
    if (isResend) { setResending(true); setResendMsg(''); }
    else          { setLoading(true); }

    try {
      await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      if (isResend) {
        setResendMsg('A new reset link has been sent!');
      } else {
        setSent(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setResending(false);
    }
  };

  return (
    <PageWrapper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', px: 2 }}>
      <Paper elevation={0} sx={{
        p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 440, borderRadius: 4,
        border: `1px solid ${BRAND.border}`, boxShadow: '0 8px 40px rgba(13,46,63,0.09)',
      }}>
        {/* Icon header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{
            width: 60, height: 60, borderRadius: 3, mx: 'auto', mb: 2,
            background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Email sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} color={BRAND.navy}>Forgot Password?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Enter your email and we'll send a reset link.
          </Typography>
        </Box>

        {sent ? (
          <>
            <Alert icon={<CheckCircle />} severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography fontWeight={600} gutterBottom>Check your inbox!</Typography>
              <Typography variant="body2">
                A password reset link was sent to <strong>{email}</strong>.
                The link expires in <strong>1 hour</strong>.
              </Typography>
            </Alert>

            {/* ── Resend option ── */}
            <Box sx={{
              p: 2, borderRadius: 2, bgcolor: `${BRAND.blue}08`,
              border: `1px solid ${BRAND.border}`, mb: 3,
            }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Didn't receive it? Check your spam folder first, then:
              </Typography>
              {resendMsg && (
                <Alert severity="success" sx={{ mb: 1, py: 0.5 }}>{resendMsg}</Alert>
              )}
              <Button
                size="small" variant="outlined"
                startIcon={resending ? <CircularProgress size={14} /> : <Refresh fontSize="small" />}
                disabled={resending}
                onClick={() => sendRequest(true)}
                sx={{ borderColor: BRAND.blue, color: BRAND.blue, textTransform: 'none' }}
              >
                {resending ? 'Sending…' : 'Resend Reset Link'}
              </Button>
            </Box>
          </>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); sendRequest(false); }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              fullWidth label="Email address" type="email" required
              value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 3 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: BRAND.blue, fontSize: 20 }} /></InputAdornment> }}
            />
            <Button type="submit" variant="contained" fullWidth size="large"
              disabled={loading} sx={{ py: 1.5 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button component={Link} to="/login" startIcon={<ArrowBack />}
            sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
            Back to Login
          </Button>
        </Box>
      </Paper>
    </PageWrapper>
  );
}