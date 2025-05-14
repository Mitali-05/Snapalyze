import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import swal from 'sweetalert2'; // Import SweetAlert2
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Work,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
    organization: '',
    role: 'user',
    subscriptionType: 'free',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      swal.fire({
        title: 'Passwords Do Not Match!',
        text: 'Please make sure both passwords are the same.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, formData);
      console.log('Registration Successful:', response.data);

      // Show success message with SweetAlert2
      swal.fire({
        title: 'Registration Successful!',
        text: 'You can now log in with your credentials.',
        icon: 'success',
        confirmButtonText: 'Go to Login',
      }).then(() => {
        navigate('/login'); // Navigate to login page after successful registration
      });

    } catch (err) {
      console.error('Registration Error:', err);

      if (err.response && err.response.data) {
        const data = err.response.data;
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          setError(data.errors[0].msg);
        } else if (typeof data === 'string') {
          setError(data);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }

      // Show error message with SweetAlert2
      swal.fire({
        title: 'Registration Failed',
        text: error || 'Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: 'Weak', color: 'error', value: 33 };
    if (score === 2 || score === 3) return { label: 'Medium', color: 'warning', value: 66 };
    return { label: 'Strong', color: 'success', value: 100 };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: 500, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            required
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

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Profession</InputLabel>
            <Select
              label="Profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
            >
              <MenuItem value="unemployed">Unemployed</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="freelancer">Freelancer</MenuItem>
              <MenuItem value="entrepreneur">Entrepreneur</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Organization (Optional)"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Work />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
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

          {formData.password && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color={`${passwordStrength.color}.main`}>
                Strength: {passwordStrength.label}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={passwordStrength.value}
                color={passwordStrength.color}
                sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
              />
            </Box>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />

          {loading && <Typography variant="body2" color="primary">Registering...</Typography>}

          <Button variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
            REGISTER
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <span
            style={{ color: 'blue', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
