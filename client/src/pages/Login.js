import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import Swal from 'sweetalert2'; // Import SweetAlert
import { useAuth } from '../context/AuthContext'; // Import useAuth from your context

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, formData);
    console.log('Login response:', response.data);
    if (response.status === 200 && response.data.token && response.data.userId) {
      // Pass both token and userId to login function from context
      login(response.data.token, response.data.userId);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back!',
      }).then(() => {
        navigate('/dashboard');
      });
    } else {
      // Handle unexpected response
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid login response from server.',
      });
    }
  } catch (err) {
    setLoading(false);

    if (err.response?.data?.errors) {
      const errorMessage = err.response.data.errors[0].msg;
      if (errorMessage === 'Email is incorrect') {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'The email address you entered is not registered. Please try again.',
        });
      } else if (errorMessage === 'Password is incorrect') {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'The password you entered is incorrect. Please try again.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: errorMessage,
        });
      }
    } else if (!err.response) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Network error. Please check your connection and try again.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Something went wrong. Please try again later.',
      });
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: 400, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            type="email"
            required
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            required
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          {loading && <Typography variant="body2" color="primary">Logging in...</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            LOGIN
          </Button>
        </form>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Typography align="center" sx={{ mt: 2 }}>
            Don’t have an account?{' '}
            <span
              style={{ color: 'blue', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
