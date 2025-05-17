import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Container,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import axios from 'axios';
import { AccountCircle, Email, Work, Business } from '@mui/icons-material';
import SavingsIcon from '@mui/icons-material/Savings';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const getPlanIcon = (planType) => {
  switch (planType) {
    case 'Free':
      return <SavingsIcon color="primary" sx={{ mr: 1 }} />;
    case 'Professional':
    case 'Pro':
      return <WorkspacePremiumIcon color="primary" sx={{ mr: 1 }} />;
    case 'Enterprise':
      return <BusinessCenterIcon color="primary" sx={{ mr: 1 }} />;
    default:
      return null;
  }
};

const pricingPlans = [
  {
    title: 'Professional',
    price: '$29',
    period: 'per month',
    features: [
      '200 image analyses per month',
      'Advanced object recognition',
      'Full API access',
      'Email support',
    ],
    buttonText: 'Subscribe Now',
  },
  {
    title: 'Enterprise',
    price: '$199',
    period: 'per month',
    features: [
      'Unlimited image analyses',
      'Custom AI models',
      'Dedicated support',
      'Onboarding assistance',
    ],
    buttonText: 'Subscribe Now',
  },
];

function Dashboard() {
  const [zipFiles, setZipFiles] = useState([]);
  const [usedSpacePercent, setUsedSpacePercent] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [filesError, setFilesError] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [maxStorage, setMaxStorage] = useState(100 * 1024 * 1024); // Default 100MB
  const [dailyUploadLimit, setDailyUploadLimit] = useState(2); // Default 2 uploads

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoadingProfile(true);
        setLoadingFiles(true);

        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { userInfo, uploads } = res.data;
        setProfile(userInfo);
        setZipFiles(uploads);

        const plan = userInfo.planType || 'Free';
        const planStorageMap = {
          Free: 100 * 1024 * 1024,
          Pro: 500 * 1024 * 1024,
          Professional: 500 * 1024 * 1024,
          Enterprise: 5 * 1024 * 1024 * 1024,
        };
        const planUploadLimitMap = {
          Free: 2,
          Pro: 10,
          Professional: 10,
          Enterprise: 100,
        };

        const planMax = planStorageMap[plan] || planStorageMap.Free;
        const planLimit = planUploadLimitMap[plan] || planUploadLimitMap.Free;

        const usedStorage = userInfo.usedStorage || 0;
        setUsedSpacePercent(Math.min((usedStorage / planMax) * 100, 100));
        setMaxStorage(planMax);
        setDailyUploadLimit(planLimit);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setFilesError('Failed to load dashboard data.');
      } finally {
        setLoadingProfile(false);
        setLoadingFiles(false);
      }
    }

    fetchDashboardData();
  }, []);

  const uploadsToday = zipFiles.length;
  const dailyUploadPercent = Math.min((uploadsToday / dailyUploadLimit) * 100, 100);
  const isUploadDisabled = uploadsToday >= dailyUploadLimit;

  const renderProfile = () => (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2, px: 2 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Profile
      </Typography>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          {loadingProfile ? (
            <Typography align="center">Loading profile...</Typography>
          ) : profile ? (
            <>
              {[
                ['First Name', profile.firstName, <AccountCircle />],
                ['Last Name', profile.lastName, <AccountCircle />],
                ['Email', profile.email, <Email />],
                ['Profession', profile.profession, <Work />],
                ['Organization', profile.organization, <Business />],
                ['Plan Type', profile.planType, getPlanIcon(profile.planType)],
              ].map(([label, value, icon], index) => (
                <React.Fragment key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                    {icon}
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      <strong>{label}:</strong> {value || 'N/A'}
                    </Typography>
                  </Box>
                  {index < 5 && <Divider />}
                </React.Fragment>
              ))}
            </>
          ) : (
            <Typography align="center" color="error">
              Unable to load profile info.
            </Typography>
          )}
        </CardContent>
      </Card>
      <Box textAlign="center" mt={4}>
        <Button variant="contained" onClick={() => setActiveView('dashboard')}>
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );

  const renderPricing = () => (
    <Container sx={{ mb: 12 }}>
      <Typography variant="h4" align="center" fontWeight="bold">
        Pricing
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4, flexWrap: 'wrap' }}>
        {pricingPlans.map((plan, i) => (
          <Card key={i} sx={{ width: 300, p: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              {plan.title}
            </Typography>
            <Typography variant="h4" color="primary">
              {plan.price}
            </Typography>
            <Typography>{plan.period}</Typography>
            <Box component="ul" sx={{ pl: 2, mt: 2 }}>
              {plan.features.map((f, j) => (
                <li key={j}>{f}</li>
              ))}
            </Box>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => {
                setSelectedPlan(plan);
                setCheckoutOpen(true);
              }}
            >
              {plan.buttonText}
            </Button>
          </Card>
        ))}
      </Box>
    </Container>
  );

  const renderDashboard = () => (
    <>
      <Typography variant="h4" align="center" sx={{ my: 4 }}>
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
        {/* Storage Card */}
        <Card sx={{ width: 250, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6">Storage Used</Typography>
            <Box sx={{ width: 120, mx: 'auto' }}>
              <CircularProgressbar
                value={usedSpacePercent}
                text={`${Math.round(usedSpacePercent)}% Used`}
                styles={buildStyles({
                  pathColor: '#00aaff',
                  textColor: '#333',
                })}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Upload Card */}
        <Card sx={{ width: 250, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6">Daily Upload Limit</Typography>
            <Box sx={{ width: 120, mx: 'auto' }}>
              <CircularProgressbar
                value={dailyUploadPercent}
                text={`${uploadsToday} / ${dailyUploadLimit}`}
                styles={buildStyles({
                  pathColor: '#007bff',
                  textColor: '#007bff',
                })}
              />
            </Box>
            <Typography sx={{ mt: 2 }} variant="body2">
              {uploadsToday < dailyUploadLimit
                ? `You can upload ${dailyUploadLimit - uploadsToday} more file${dailyUploadLimit - uploadsToday > 1 ? 's' : ''} today.`
                : 'Daily upload limit reached.'}
            </Typography>
            {isUploadDisabled && (
              <Button sx={{ mt: 1 }} variant="outlined" onClick={() => setActiveView('pricing')}>
                View Pricing Plans
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Files Table */}
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        Your Uploaded Files
      </Typography>
      <Card sx={{ maxHeight: 350, overflowY: 'auto', mx: 'auto', maxWidth: 700, p: 2 }}>
        {loadingFiles ? (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : filesError ? (
          <Typography color="error">{filesError}</Typography>
        ) : zipFiles.length === 0 ? (
          <Typography>No files uploaded yet.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell align="right">Size (MB)</TableCell>
                  <TableCell align="right">Uploaded At</TableCell>
                  <TableCell align="right">Image Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {zipFiles.map((file) => (
                  <TableRow key={file._id}>
                    <TableCell>{file.name || file.originalFileName}</TableCell>
                    <TableCell align="right">
                      {((file.size || file.fileSize) / (1024 * 1024)).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">{file.imageCount || file.images?.length || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </>
  );

  return (
    <Box>
      <Header setActiveView={setActiveView} />
      <Box sx={{ pt: 4 }}>
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'profile' && renderProfile()}
        {activeView === 'pricing' && renderPricing()}
      </Box>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Checkout - {selectedPlan?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            You selected the <strong>{selectedPlan?.title}</strong> plan.
          </Typography>
          <Typography>
            Price: <strong>{selectedPlan?.price}</strong> {selectedPlan?.period}
          </Typography>
          <ul style={{ paddingLeft: 20 }}>
            {selectedPlan?.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutOpen(false)}>Cancel</Button>
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

export default Dashboard;
