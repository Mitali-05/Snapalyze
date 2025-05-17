import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Stack,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  AccountCircle,
  Email,
  Work,
  Business,
} from '@mui/icons-material';

import ClassifyResults from './ClassifyResults';
import OcrResults from './OcrResults';
import AnalysisResults from './AnalysisResults';
import Header from '../components/Header';
import { CircularProgress } from '@mui/material';


const getPlanIcon = (planType) => {
  switch (planType) {
    case 'premium':
      return <Business color="primary" sx={{ mr: 1 }} />;
    case 'basic':
      return <Work color="primary" sx={{ mr: 1 }} />;
    default:
      return <AccountCircle color="primary" sx={{ mr: 1 }} />;
  }
};

function Upload() {
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState('');
  const [zipId, setZipId] = useState(null);
  const [view, setView] = useState(null); // 'ocr', 'classify', 'analysis'
  const [activeView, setActiveView] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
  if (activeView === 'profile') {
    setLoadingProfile(true);
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:5000/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log('Profile API response:', res.data);
        setProfile(res.data.userInfo); // <-- use userInfo here
        setLoadingProfile(false);
      })
      .catch((err) => {
        console.error('Profile fetch error:', err);
        setProfile(null);
        setLoadingProfile(false);
      });
  }
}, [activeView]);

  const onDrop = useCallback(async (acceptedFiles) => {
  setUploading(true);  // start spinner
  const formData = new FormData();
  formData.append('file', acceptedFiles[0]);

  try {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/zip/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMessage(res.data.message);
    setZipId(res.data.zipId);
    setView(null);
  } catch (err) {
    setMessage('Upload failed.');
    setZipId(null);
    setView(null);
    console.error('Upload error:', err);
  } finally {
    setUploading(false);  // stop spinner
  }
}, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/zip': ['.zip'] },
    maxFiles: 1,
  });

  const handleExtractText = () => setView('ocr');
  const handleClassifyImages = () => setView('classify');
  const handleAnalyze = () => setView('analysis');

  const renderProfile = () => (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2, px: 2 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Profile
      </Typography>

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          {loadingProfile ? (
            <Typography align="center" color="text.secondary">
              Loading profile...
            </Typography>
          ) : profile ? (
            <Box sx={{ px: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountCircle color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <strong>First Name:</strong> {profile.firstName || 'N/A'}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <AccountCircle color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <strong>Last Name:</strong> {profile.lastName || 'N/A'}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Email color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <strong>Email:</strong> {profile.email || 'N/A'}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Work color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <strong>Profession:</strong> {profile.profession || 'N/A'}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Business color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <strong>Organization:</strong> {profile.organization || 'N/A'}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getPlanIcon(profile.planType)}
                <Typography variant="body1">
                  <strong>Plan Type:</strong> {profile.planType || 'N/A'}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography align="center" color="error">
              Unable to load profile info.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Box textAlign="center" mt={4}>
        <Button variant="contained" size="large" onClick={() => setActiveView('dashboard')}>
          Back to Upload
        </Button>
      </Box>
    </Box>
  );

  const renderDashboard = () => (
    <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
      Dashboard content goes here.
    </Typography>
  );

  const renderPricing = () => (
    <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
      Pricing content goes here.
    </Typography>
  );

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoadingProfile(true);
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) throw new Error('Missing credentials');
        const res = await axios.get(`http://localhost:5000/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  return (
    <Box>
      <Header setActiveView={setActiveView} />
      <Box p={4} maxWidth="900px" mx="auto">
        {activeView === 'dashboard' && (
          <>
            <Grid container spacing={15} alignItems="stretch">
              <Grid item xs={12} md={5}>
                <Paper
                  {...getRootProps()}
                  elevation={isDragActive ? 12 : 3}
                  sx={{
                    p: 5,
                    textAlign: 'center',
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.400',
                    bgcolor: isDragActive ? 'primary.light' : 'background.paper',
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 2,
                    borderRadius: 2,
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography variant="h6" fontWeight="medium">
                    {isDragActive ? 'Drop your .zip file here...' : 'Upload a .zip file'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drag & drop or click to select
                  </Typography>
                  <Button
  variant="contained"
  size="large"
  sx={{ mt: 2 }}
  disabled={uploading} // disable button while uploading
>
  {uploading ? <CircularProgress size={24} color="inherit" /> : 'Select File'}
</Button>

                  {message && (
                    <Typography
                      sx={{ mt: 3, fontWeight: 'medium' }}
                      color={message.toLowerCase().includes('failed') ? 'error' : 'success.main'}
                    >
                      {message}
                    </Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item md={1} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <Divider orientation="vertical" flexItem />
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 5, height: '100%', borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Actions
                  </Typography>

                  <Stack spacing={3} mt={3}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      disabled={!zipId}
                      onClick={handleAnalyze}
                      fullWidth
                    >
                      Analyze
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      disabled={!zipId}
                      onClick={handleClassifyImages}
                      fullWidth
                    >
                      Classify Images
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      disabled={!zipId}
                      onClick={handleExtractText}
                      fullWidth
                    >
                      Extract Text
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            <Box mt={6}>
              <Divider sx={{ mb: 4 }} />
              {zipId && view === 'analysis' && <AnalysisResults zipId={zipId} />}
              {zipId && view === 'ocr' && <OcrResults zipId={zipId} />}
              {zipId && view === 'classify' && <ClassifyResults zipId={zipId} />}
            </Box>
          </>
        )}

        {activeView === 'profile' && renderProfile()}
        {activeView === 'pricing' && renderPricing()}
      </Box>

      <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Checkout - {selectedPlan?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            You selected the <strong>{selectedPlan?.title}</strong> plan.
          </Typography>
          <Typography>
            Price: <strong>{selectedPlan?.price}</strong> {selectedPlan?.period}
          </Typography>
          <ul style={{ paddingLeft: 20 }}>
            {selectedPlan?.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              Swal.fire({
                icon: 'success',
                title: `Proceeding to payment`,
                html: `You selected the <strong>${selectedPlan?.title}</strong> plan.`,
                confirmButtonText: 'Continue',
              });
              setCheckoutOpen(false);
            }}
          >
            Proceed to Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Upload;
