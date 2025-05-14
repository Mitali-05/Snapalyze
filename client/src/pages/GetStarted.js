import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Typography, Paper } from '@mui/material';

function GetStarted() {
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login'); // Redirect if no user
      return;
    }

    const fetchUserPlan = async () => {
      try {
        const res = await axios.get(`/api/user/${userId}/plan`);
        setUserPlan(res.data.plan);
      } catch (error) {
        console.error('Error fetching user plan:', error);
        navigate('/pricing'); // Fallback if error
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, [userId, navigate]);

  const getAttemptCount = () => {
    const attempts = localStorage.getItem('attempts');
    const parsed = parseInt(attempts);
    return isNaN(parsed) ? 0 : parsed;
  };

  const increaseAttemptCount = () => {
    const current = getAttemptCount();
    localStorage.setItem('attempts', current + 1);
  };

  const navigateTo = (option) => {
    if (option === 'analyze') navigate('/analyze-text');
    else if (option === 'extract') navigate('/text-extraction');
    else if (option === 'classify') navigate('/classify-images');
  };

  const handleOptionSelection = (option) => {
    if (!userPlan) return;

    if (userPlan === 'Pro') {
      navigateTo(option);
    } else if (userPlan === 'Basic') {
      const attempts = getAttemptCount();
      if (attempts < 2) {
        increaseAttemptCount();
        navigateTo(option);
      } else {
        alert('You have reached your 2 attempts for the Basic plan.');
      }
    } else {
      alert('Invalid plan. Please select a plan first.');
      navigate('/pricing');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        You have selected the {userPlan} plan. Choose an option:
      </Typography>

      <Box display="flex" gap={3}>
        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6">Analyze Text</Typography>
          <Button
            onClick={() => handleOptionSelection('analyze')}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Go to Analyze Text
          </Button>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6">Text Extraction</Typography>
          <Button
            onClick={() => handleOptionSelection('extract')}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Go to Text Extraction
          </Button>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6">Classify Images</Typography>
          <Button
            onClick={() => handleOptionSelection('classify')}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Go to Classify Images
          </Button>
        </Paper>
      </Box>

      {userPlan === 'Basic' && (
        <Typography mt={3} color="textSecondary">
          Attempts used: {getAttemptCount()} / 2
        </Typography>
      )}
    </Box>
  );
}

export default GetStarted;
