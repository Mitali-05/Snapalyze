import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, CircularProgress, Alert, Button, Chip, Paper,
  Dialog, DialogTitle, DialogContent, IconButton, TextField,
  InputAdornment, LinearProgress, Skeleton, Grid, Divider,
} from '@mui/material';
import CloseIcon   from '@mui/icons-material/Close';
import SearchIcon  from '@mui/icons-material/Search';
import ImageIcon   from '@mui/icons-material/Image';
import { BRAND }   from '../theme/theme';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ClassifyResults({ zipId }) {
  const [results,        setResults]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [openDialog,     setOpenDialog]     = useState(false);
  const [selectedImage,  setSelectedImage]  = useState(null);
  const [selectedName,   setSelectedName]   = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    if (!zipId) return;
    const fetch = async () => {
      try {
        setLoading(true); setError(null);
        const res = await axios.get(`${API_URL}/api/zip/classify/${zipId}`, { headers: authHeader });
        setResults(res.data.results || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch classification results.');
      } finally { setLoading(false); }
    };
    fetch();
  }, [zipId]);

  const handleViewImage = async (filename) => {
    setPreviewLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/zip/analyze/${zipId}`, { headers: authHeader });
      const match = res.data.analyzed?.find((img) => img.filename === filename);
      if (match?.imagePreview) { setSelectedImage(match.imagePreview); setSelectedName(filename); setOpenDialog(true); }
    } catch { } finally { setPreviewLoading(false); }
  };

  const filtered = results.filter((r) =>
    r.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.predictions?.[0]?.label?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <Box>
      <Typography variant="h5" fontWeight={700} color={BRAND.navy} gutterBottom>Classification Results</Typography>
      <Grid container spacing={2}>
        {[1,2,3].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Skeleton height={22} width="60%" sx={{ mb: 1 }} />
              <Skeleton height={16} /><Skeleton height={16} width="75%" />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!results.length) return <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No classification results found.</Typography>;

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb: 3, flexWrap:'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color={BRAND.navy}>Classification Results</Typography>
          <Typography variant="body2" color="text.secondary">{results.length} image{results.length !== 1 ? 's' : ''} classified</Typography>
        </Box>
        <TextField size="small" placeholder="Search filename or label…"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ width: 260 }} />
      </Box>

      <Grid container spacing={2}>
        {filtered.map((img, idx) => {
          const top  = img.predictions?.[0];
          const conf = top ? top.confidence * 100 : 0;
          return (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper variant="outlined" sx={{
                borderRadius: 3, overflow: 'hidden', height: '100%',
                display: 'flex', flexDirection: 'column',
                borderColor: BRAND.border,
                transition: 'all 0.18s',
                '&:hover': { borderColor: BRAND.blue, boxShadow: `0 4px 20px ${BRAND.blue}20` },
              }}>
                {/* Header */}
                <Box sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderBottom: `1px solid ${BRAND.border}` }}>
                  <Typography variant="body2" fontWeight={600} color={BRAND.navy} noWrap title={img.filename}>
                    {img.filename}
                  </Typography>
                </Box>

                {/* Body */}
                <Box sx={{ px: 2, py: 2, flexGrow: 1 }}>
                  {top ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={700} color={BRAND.blue} sx={{ textTransform: 'capitalize' }}>
                          {top.label}
                        </Typography>
                        <Chip
                          label={`${conf.toFixed(1)}%`} size="small"
                          sx={{
                            bgcolor: conf > 60 ? `${BRAND.teal}20` : conf > 30 ? '#f59e0b20' : 'grey.100',
                            color:   conf > 60 ? BRAND.teal : conf > 30 ? '#f59e0b' : 'text.secondary',
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate" value={conf}
                        sx={{
                          height: 6, mb: 2,
                          bgcolor: `${BRAND.border}`,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: conf > 60 ? BRAND.teal : conf > 30 ? '#f59e0b' : 'grey.400',
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" fontWeight={600}
                        sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.75 }}>
                        All Predictions
                      </Typography>
                      {img.predictions.slice(0, 3).map((pred, i) => (
                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                            {i + 1}. {pred.label}
                          </Typography>
                          <Typography variant="caption" fontWeight={700}
                            sx={{ color: i === 0 ? BRAND.blue : 'text.secondary' }}>
                            {(pred.confidence * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.disabled" fontStyle="italic">
                      {img.error || 'No predictions available.'}
                    </Typography>
                  )}
                </Box>

                {/* Footer */}
                <Box sx={{ px: 2, py: 1.5, borderTop: `1px solid ${BRAND.border}` }}>
                  <Button size="small" variant="outlined" fullWidth
                    startIcon={<ImageIcon fontSize="small" />}
                    onClick={() => handleViewImage(img.filename)} disabled={previewLoading}
                    sx={{ textTransform: 'none', fontSize: '0.78rem', borderColor: BRAND.blue, color: BRAND.blue }}>
                    View Image
                  </Button>
                </Box>
              </Paper>
            </Grid>
          );
        })}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>No results match your search.</Typography>
          </Grid>
        )}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pr: 6, color: BRAND.navy, fontWeight: 700 }}>
          {selectedName}
          <IconButton onClick={() => setOpenDialog(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedImage && <img src={selectedImage} alt="preview" style={{ width: '100%', height: 'auto', borderRadius: 8 }} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
}