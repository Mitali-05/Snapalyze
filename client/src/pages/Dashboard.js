import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, CircularProgress,
  Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Avatar, Grid, Tooltip, IconButton, Alert, Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import DeleteIcon           from '@mui/icons-material/Delete';
import DeleteSweepIcon      from '@mui/icons-material/DeleteSweep';
import CloudUploadIcon      from '@mui/icons-material/CloudUpload';
import FolderIcon           from '@mui/icons-material/Folder';
import BarChartIcon         from '@mui/icons-material/BarChart';
import AccountCircleIcon    from '@mui/icons-material/AccountCircle';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BusinessCenterIcon   from '@mui/icons-material/BusinessCenter';
import SavingsIcon          from '@mui/icons-material/Savings';
import { Email, Work, Business } from '@mui/icons-material';

import Header, { CONTENT_MAX } from '../components/Header';
import InsightsPanel            from '../components/InsightsPanel';
import ChangePassword           from '../components/ChangePassword';
import PageWrapper              from '../components/PageWrapper';
import useToast                 from '../hooks/useToast';
import ToastSnackbar            from '../components/ToastSnackbar';
import { BRAND }                from '../theme/theme';

const API_URL    = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const PLAN_STORE = { Free: 10*1024*1024, Pro: 100*1024*1024, Enterprise: 1024*1024*1024 };
const PLAN_LIMIT = { Free: 2, Pro: 10, Enterprise: 50 };
const PRICING    = [
  { title: 'Pro',        price: '$29',  period: '/month', color: BRAND.blue,
    features: ['10 uploads/day','100MB storage','Priority support','Full API access'] },
  { title: 'Enterprise', price: '$199', period: '/month', color: BRAND.teal,
    features: ['50 uploads/day','1GB storage','Dedicated support','Custom AI models'] },
];

const fmt = {
  bytes: (b) => b >= 1048576 ? `${(b/1048576).toFixed(1)} MB` : `${(b/1024).toFixed(0)} KB`,
  date:  (d) => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
};

const getPlanIcon = (p) =>
  p === 'Pro' ? <WorkspacePremiumIcon /> : p === 'Enterprise' ? <BusinessCenterIcon /> : <SavingsIcon />;

// Consistent container — same maxWidth as Header
const PageContent = ({ children }) => (
  <Box sx={{ maxWidth: CONTENT_MAX, width: '100%', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
    {children}
  </Box>
);

export default function Dashboard() {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [checkout,   setCheckout]   = useState({ open: false, plan: null });
  const { toast, toastState, handleClose } = useToast();
  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data);
    } catch { setError('Failed to load dashboard data.'); }
    finally   { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const profile      = data?.userInfo || {};
  const uploads      = data?.uploads  || [];
  const insights     = data?.insights;
  const planType     = profile.planType || 'Free';
  const maxStorage   = PLAN_STORE[planType] ?? PLAN_STORE.Free;
  const dailyLimit   = PLAN_LIMIT[planType] ?? PLAN_LIMIT.Free;
  const dailyCount   = profile.dailyUploadCount ?? 0;
  const usedStorage  = profile.usedStorage      ?? 0;
  const storagePct   = Math.min((usedStorage / maxStorage) * 100, 100);
  const uploadPct    = Math.min((dailyCount / dailyLimit) * 100, 100);
  const limitReached = dailyCount >= dailyLimit;
  const authHeader   = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  // ── Delete single ──────────────────────────────────────────────────────────
  const handleDeleteOne = async (zipId, fileName) => {
    const result = await Swal.fire({
      title: 'Delete this upload?', html: `<b>${fileName}</b>`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#e53935', confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_URL}/api/zip/${zipId}`, { headers: authHeader });
      toast.success('Upload deleted');
      fetchDashboard();
    } catch { toast.error('Delete failed.'); }
  };

  // ── Delete all ─────────────────────────────────────────────────────────────
  const handleDeleteAll = async () => {
    const result = await Swal.fire({
      title: 'Delete ALL uploads?',
      html: `<b>${uploads.length} upload${uploads.length !== 1 ? 's' : ''}</b> will be permanently deleted.`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#e53935', confirmButtonText: 'Delete All',
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_URL}/api/zip/all`, { headers: authHeader });
      toast.success('All uploads deleted');
      fetchDashboard();
    } catch { toast.error('Failed to delete all.'); }
  };

  // ── DASHBOARD VIEW ─────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <PageContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color={BRAND.navy}>
            Welcome back, {profile.firstName} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<CloudUploadIcon />}
          disabled={limitReached} onClick={() => navigate('/upload')} sx={{ height: 40 }}>
          {limitReached ? 'Limit Reached' : 'Upload New ZIP'}
        </Button>
      </Box>

      {/* Stats row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: '20px !important' }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>Storage Used</Typography>
              <Box sx={{ width: 100, mx: 'auto', my: 1 }}>
                <CircularProgressbar value={storagePct} text={`${Math.round(storagePct)}%`}
                  styles={buildStyles({ pathColor: BRAND.blue, textColor: BRAND.navy, trailColor: BRAND.border, textSize: '22px' })} />
              </Box>
              <Typography variant="caption" color="text.secondary">{fmt.bytes(usedStorage)} / {fmt.bytes(maxStorage)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: '20px !important' }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>Daily Uploads</Typography>
              <Box sx={{ width: 100, mx: 'auto', my: 1 }}>
                <CircularProgressbar value={uploadPct} text={`${dailyCount}/${dailyLimit}`}
                  styles={buildStyles({
                    pathColor: limitReached ? '#e53935' : BRAND.green,
                    textColor: BRAND.navy, trailColor: BRAND.border, textSize: '20px',
                  })} />
              </Box>
              <Typography variant="caption" color={limitReached ? 'error' : 'text.secondary'}>
                {limitReached ? 'Resets at midnight UTC' : `${dailyLimit - dailyCount} remaining`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyLight} 60%, ${BRAND.teal} 100%)` }}>
            <CardContent sx={{ p: '20px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {React.cloneElement(getPlanIcon(planType), { sx: { color: '#fff', fontSize: 26 } })}
                <Typography variant="h6" fontWeight={700} color="#fff">{planType} Plan</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.78)', mb: 1.5 }}>
                {dailyLimit} uploads/day · {fmt.bytes(maxStorage)}
              </Typography>
              {planType === 'Free' && (
                <Button size="small" variant="outlined" onClick={() => setActiveView('pricing')}
                  sx={{ color:'#fff', borderColor:'rgba(255,255,255,0.5)', fontSize:'0.75rem',
                    '&:hover': { borderColor:'#fff', background:'rgba(255,255,255,0.1)' } }}>
                  Upgrade →
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: '20px !important' }}>
              <FolderIcon sx={{ fontSize: 40, color: BRAND.teal, mb: 1 }} />
              <Typography variant="h4" fontWeight={800} color={BRAND.navy}>{uploads.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Uploads</Typography>
              <Typography variant="caption" color="text.secondary">{insights?.totalImages || 0} images total</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Insights */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: '24px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BarChartIcon sx={{ color: BRAND.blue }} />
            <Typography variant="h6" fontWeight={700} color={BRAND.navy}>Insights</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <InsightsPanel insights={insights} />
        </CardContent>
      </Card>

      {/* Upload history */}
      <Card>
        <CardContent sx={{ p: '24px !important' }}>
          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb: 2, flexWrap:'wrap', gap: 2 }}>
            <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
              <FolderIcon sx={{ color: BRAND.teal }} />
              <Typography variant="h6" fontWeight={700} color={BRAND.navy}>Upload History</Typography>
              <Chip label={uploads.length} size="small" color="primary" variant="outlined" />
            </Box>
            {uploads.length > 0 && (
              <Button size="small" variant="outlined" color="error"
                startIcon={<DeleteSweepIcon />} onClick={handleDeleteAll} sx={{ textTransform:'none' }}>
                Delete All
              </Button>
            )}
          </Box>

          {uploads.length === 0 ? (
            <Box sx={{ textAlign:'center', py: 5 }}>
              <FolderIcon sx={{ fontSize: 52, color:'text.disabled', mb: 1 }} />
              <Typography color="text.secondary" variant="body2" gutterBottom>No uploads yet.</Typography>
              <Button variant="contained" onClick={() => navigate('/upload')} sx={{ mt: 1 }}>Upload Now</Button>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell align="center">Images</TableCell>
                    <TableCell align="right">Size</TableCell>
                    <TableCell align="right">Uploaded</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uploads.map((zip) => (
                    <TableRow key={zip._id} hover>
                      <TableCell>
                        <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
                          <Avatar sx={{ width:28, height:28, bgcolor:`${BRAND.blue}22`, color: BRAND.blue, fontSize:12 }}>
                            {zip.originalFileName?.[0]?.toUpperCase() || 'Z'}
                          </Avatar>
                          <Tooltip title={zip.originalFileName}>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 260 }}>{zip.originalFileName}</Typography>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell align="center"><Chip label={zip.images?.length || 0} size="small" /></TableCell>
                      <TableCell align="right"><Typography variant="body2">{fmt.bytes(zip.fileSize || 0)}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2" color="text.secondary">{fmt.date(zip.uploadedAt)}</Typography></TableCell>
                      <TableCell align="center">
                        <Box sx={{ display:'flex', gap:0.5, justifyContent:'center' }}>
                          <Button size="small" variant="outlined" sx={{ fontSize:'0.72rem', textTransform:'none' }}
                            onClick={() => navigate('/upload', { state: { zipId: zip._id } })}>
                            Analyze
                          </Button>
                          <Tooltip title="Delete & free storage">
                            <IconButton size="small" color="error" onClick={() => handleDeleteOne(zip._id, zip.originalFileName)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </PageContent>
  );

  // ── PROFILE VIEW —
  const renderProfile = () => (
    <PageContent>
      {/* Centered single card */}
      <Box sx={{ maxWidth: 520, mx: 'auto' }}>
        <Card>
          <CardContent sx={{ p: '32px !important' }}>
            {/* Avatar + name header */}
            <Box sx={{ display:'flex', alignItems:'center', gap: 2, mb: 3 }}>
              <Avatar sx={{
                width: 64, height: 64,
                background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})`,
                fontSize: 22, fontWeight: 700,
              }}>
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} color={BRAND.navy}>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Chip label={profile.planType} size="small" color="primary" variant="outlined" sx={{ mt: 0.5 }} />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Profile fields */}
            {[
              [<AccountCircleIcon />, 'Full Name',     `${profile.firstName} ${profile.lastName}`],
              [<Email />,             'Email',          profile.email],
              [<Work />,              'Profession',     profile.profession],
              [<Business />,          'Organization',   profile.organization || '—'],
              [getPlanIcon(planType), 'Plan',           profile.planType],
            ].map(([icon, label, value]) => (
              <Box key={label} sx={{ display:'flex', alignItems:'center', py: 1.5, gap: 2 }}>
                {React.cloneElement(icon, { sx: { color: BRAND.blue, fontSize: 20, flexShrink: 0 } })}
                <Typography variant="body2" color="text.secondary" sx={{ width: 120, flexShrink: 0 }}>
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={500} color={BRAND.navy}>{value}</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 3 }} />

            {/* Action buttons */}
            <Box sx={{ display:'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setActiveView('dashboard')}
                sx={{ textTransform:'none' }}
              >
                ← Back
              </Button>
              <Button
                variant="contained"
                onClick={() => setActiveView('changePassword')}
                sx={{ textTransform:'none' }}
              >
                Change Password
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageContent>
  );

  // ── CHANGE PASSWORD VIEW — 
  const renderChangePassword = () => (
    <PageContent>
      <Box sx={{ maxWidth: 520, mx: 'auto' }}>
        <Card>
          <CardContent sx={{ p: '32px !important' }}>
            <ChangePassword
              onSuccess={() => {
                toast.success('Password updated successfully!');
                setActiveView('profile');
              }}
            />
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setActiveView('profile')}
                sx={{ textTransform:'none' }}
              >
                ← Back to Profile
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageContent>
  );

  // ── PRICING VIEW ─────
  const renderPricing = () => (
    <PageContent>
      <Box sx={{ mb: 4, textAlign:'center' }}>
        <Typography variant="h4" fontWeight={800} color={BRAND.navy} gutterBottom>Upgrade Your Plan</Typography>
        <Typography variant="body1" color="text.secondary">Unlock more uploads, storage, and features.</Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        {PRICING.map((plan) => (
          <Grid item xs={12} sm={6} md={5} key={plan.title}>
            <Card sx={{ border:`2px solid ${plan.color}33`, height:'100%' }}>
              <Box sx={{ p: 0.5, background:`linear-gradient(135deg, ${plan.color}15, ${plan.color}08)` }}>
                <CardContent>
                  <Typography variant="h5" fontWeight={800} color={plan.color}>{plan.title}</Typography>
                  <Box sx={{ display:'flex', alignItems:'baseline', gap:0.5, my:1 }}>
                    <Typography variant="h3" fontWeight={800} color={BRAND.navy}>{plan.price}</Typography>
                    <Typography color="text.secondary">{plan.period}</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  {plan.features.map((f) => (
                    <Typography key={f} variant="body2" sx={{ py: 0.5 }}>
                      <span style={{ color: plan.color, marginRight: 8 }}>✓</span>{f}
                    </Typography>
                  ))}
                  <Button fullWidth variant="contained" sx={{ mt: 3, textTransform:'none',
                    background:`linear-gradient(135deg, ${plan.color}, ${plan.color}cc)` }}
                    onClick={() => setCheckout({ open: true, plan })}>
                    Subscribe Now
                  </Button>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageContent>
  );

  return (
    <PageWrapper>
      <Header setActiveView={setActiveView} />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <PageContent><Alert severity="error">{error}</Alert></PageContent>
      ) : (
        <>
          {activeView === 'dashboard'      && renderDashboard()}
          {activeView === 'profile'        && renderProfile()}
          {activeView === 'changePassword' && renderChangePassword()}
          {activeView === 'pricing'        && renderPricing()}
        </>
      )}

      {/* Checkout dialog */}
      <Dialog open={checkout.open} onClose={() => setCheckout({ open:false, plan:null })} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700} color={BRAND.navy}>Checkout — {checkout.plan?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="h4" fontWeight={800} color={checkout.plan?.color}>
            {checkout.plan?.price}
            <span style={{ fontSize:14, color:'#4a6070' }}>{checkout.plan?.period}</span>
          </Typography>
          <Box sx={{ mt: 2 }}>
            {checkout.plan?.features.map((f) => (
              <Typography key={f} variant="body2" sx={{ py: 0.4 }}>
                <span style={{ color: checkout.plan?.color, marginRight: 6 }}>✓</span>{f}
              </Typography>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3 }}>
          <Button onClick={() => setCheckout({ open:false, plan:null })} sx={{ textTransform:'none' }}>Cancel</Button>
          <Button variant="contained" sx={{ textTransform:'none' }}
            onClick={() => {
              setCheckout({ open:false, plan:null });
              Swal.fire({ icon:'info', title:'Payment gateway', text:'Integrate Razorpay or Stripe here.', confirmButtonText:'OK' });
            }}>
            Proceed to Pay
          </Button>
        </DialogActions>
      </Dialog>

      <ToastSnackbar state={toastState} onClose={handleClose} />
    </PageWrapper>
  );
}