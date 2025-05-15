import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Typography, Paper } from '@mui/material';

function Pricing() {
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planSelected, setPlanSelected] = useState(false);
  const navigate = useNavigate();

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

  // const handlePlanSelection = async (selectedPlan) => {
  //   try {
  //     if (!userId) {
  //       console.error('No userId found in localStorage');
  //       return;
  //     }

  //     const response = await axios.post('/api/user/plan', { userId, plan: selectedPlan });
  //     console.log('Plan updated:', response.data);

  //     setPlanSelected(true);
  //     navigate('/upload');
  //   } catch (err) {
  //     console.error('Error selecting plan:', err);
  //   }
  // };
  const handlePlanSelection = async (selectedPlan) => {
  try {
    if (!userId) {
      console.error('No userId found in localStorage');
      return;
    }

    const response = await axios.post('/api/user/plan', { userId, plan: selectedPlan });
    console.log('Plan updated:', response.data);

    setPlanSelected(true);
    // Redirect to checkout page with selected plan info
    navigate('/checkout', { state: { plan: selectedPlan } });
  } catch (err) {
    console.error('Error selecting plan:', err);
  }
};


  const handleOptionSelection = (option) => {
    if (option === 'analyze') navigate('/analyze-text');
    else if (option === 'extract') navigate('/text-extraction');
    else if (option === 'classify') navigate('/classify-images');
  };

  if (loading) return <div>Loading...</div>;

  const plans = [
    {
      name: 'Basic',
      price: '₹0',
      validity: 'Lifetime',
      attempts: '2 total',
      features: ['Limited features', 'No support'],
      buttonVariant: 'outlined',
      color: 'primary'
    },
    {
      name: 'Pro',
      price: '₹299 / month',
      validity: '30 days',
      attempts: 'Unlimited',
      features: ['Fast processing', 'Priority support'],
      buttonVariant: 'contained',
      color: 'primary'
    },
    {
      name: 'Premium',
      price: '₹699 / 3 months',
      validity: '90 days',
      attempts: 'Unlimited',
      features: ['Fastest speed', 'Dedicated support'],
      buttonVariant: 'contained',
      color: 'secondary'
    },
    {
      name: 'Enterprise',
      price: '₹1999 / year',
      validity: '365 days',
      attempts: 'Unlimited + API Access',
      features: ['Multi-user', 'Analytics Dashboard'],
      buttonVariant: 'contained',
      color: 'success'
    },
    {
      name: 'Student',
      price: '₹99 / semester',
      validity: '6 months',
      attempts: '100',
      features: ['Affordable access', 'Email support'],
      buttonVariant: 'outlined',
      color: 'info'
    }
  ];

  return (
    <Box p={4}>
      {planSelected ? (
        <Box>
          <Typography variant="h4" gutterBottom>
            You have selected the {userPlan} plan. Choose an option:
          </Typography>
          <Box display="flex" gap={3} flexWrap="wrap">
            {['analyze', 'extract', 'classify'].map((option) => (
              <Paper key={option} elevation={3} sx={{ p: 2, textAlign: 'center', width: 250 }}>
                <Typography variant="h6">{option.replace('-', ' ')}</Typography>
                <Button
                  onClick={() => handleOptionSelection(option)}
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  Go to {option.replace('-', ' ')}
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom>
            Choose a Subscription Plan
          </Typography>
          <Box display="flex" gap={3} flexWrap="wrap">
            {plans.map((plan) => (
              <Paper key={plan.name} elevation={4} sx={{ p: 3, width: 280 }}>
                <Typography variant="h6" gutterBottom>{plan.name}</Typography>
                <Typography variant="subtitle1">{plan.price}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Validity: {plan.validity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Attempts: {plan.attempts}
                </Typography>
                <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <Button
                  onClick={() => handlePlanSelection(plan.name)}
                  variant={plan.buttonVariant}
                  color={plan.color}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Choose {plan.name}
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Pricing;
