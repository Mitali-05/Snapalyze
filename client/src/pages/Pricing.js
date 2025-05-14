import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Typography, Paper } from '@mui/material';

function Pricing() {
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planSelected, setPlanSelected] = useState(false);
  const navigate = useNavigate();

  // Replace this with your actual auth method (context, localStorage, etc.)
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const res = await axios.get(`/api/user/${userId}/plan`);
        setUserPlan(res.data.plan);
      } catch (error) {
        console.error('Error fetching user plan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, [userId]);

const handlePlanSelection = async (selectedPlan) => {
  try {
    if (!userId) {
      console.error('No userId found in localStorage');
      return;
    }

    const response = await axios.post('/api/user/plan', { userId, plan: selectedPlan });
    console.log('Plan updated:', response.data);

    setPlanSelected(true); // Allow rendering the next options if needed
    navigate('/upload');
  } catch (err) {
    console.error('Error selecting plan:', err);
  }
};



  const handleOptionSelection = (option) => {
    // Navigate to the respective page based on the option
    if (option === 'analyze') {
      navigate('/analyze-text');
    } else if (option === 'extract') {
      navigate('/text-extraction');
    } else if (option === 'classify') {
      navigate('/classify-images');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Box p={4}>
      {planSelected ? (
        <Box>
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
        </Box>
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom>Select a Plan</Typography>
          <Box display="flex" gap={3}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Basic</Typography>
              <Typography>Free plan with limited uploads</Typography>
              <Button
                onClick={() => handlePlanSelection('Basic')}
                variant="outlined"
                sx={{ mt: 2 }}
              >
                Choose Basic
              </Button>
            </Paper>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Pro</Typography>
              <Typography>Unlimited uploads and faster processing</Typography>
              <Button
                onClick={() => handlePlanSelection('Pro')}
                variant="contained"
                sx={{ mt: 2 }}
              >
                Choose Pro
              </Button>
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Pricing;
