import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Alert, Button, Chip, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, IconButton, Skeleton, Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BRAND } from '../theme/theme';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AnalysisResults({ zipId }) {
  const [results,       setResults]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [openDialog,    setOpenDialog]    = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedName,  setSelectedName]  = useState('');

  useEffect(() => {
    if (!zipId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/zip/analyze/${zipId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data.analyzed || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analysis.');
      } finally { setLoading(false); }
    };
    fetch();
  }, [zipId]);

  if (loading) return (
    <Box>
      <Typography variant="h5" fontWeight={700} color={BRAND.navy} gutterBottom>Analysis Results</Typography>
      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
        {[1,2,3].map((i) => (
          <Box key={i} sx={{ p: 2, borderBottom: i < 3 ? `1px solid ${BRAND.border}` : 'none', display:'flex', gap:2 }}>
            <Skeleton width="35%" height={20} /><Skeleton width="10%" height={20} />
            <Skeleton width="15%" height={20} /><Skeleton width="10%" height={20} />
          </Box>
        ))}
      </Paper>
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!results.length) return <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No analysis results found.</Typography>;

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700} color={BRAND.navy}>Analysis Results</Typography>
        <Chip label={`${results.length} image${results.length !== 1 ? 's' : ''}`} color="primary" variant="outlined" />
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Filename</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="center">Dimensions</TableCell>
              <TableCell align="center">Text</TableCell>
              <TableCell align="right">Time (ms)</TableCell>
              <TableCell align="center">Preview</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((item, idx) => (
              <TableRow key={idx} hover>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 240, color: BRAND.navy }} title={item.filename}>
                    {item.filename}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {item.fileSize ? `${(item.fileSize / 1024).toFixed(0)} KB` : '—'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {item.imageDimensions?.width ? `${item.imageDimensions.width}×${item.imageDimensions.height}` : '—'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {item.error ? (
                    <Chip label="Error" size="small" color="error" variant="outlined" />
                  ) : (
                    <Chip
                      label={item.hasText ? 'Yes' : 'No'} size="small" variant="outlined"
                      sx={{
                        borderColor: item.hasText ? BRAND.teal : BRAND.border,
                        color: item.hasText ? BRAND.teal : 'text.secondary',
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="text.secondary">{item.processingTimeMs ?? '—'}</Typography>
                </TableCell>
                <TableCell align="center">
                  {item.imagePreview ? (
                    <Button size="small" variant="outlined"
                      onClick={() => { setSelectedImage(item.imagePreview); setSelectedName(item.filename); setOpenDialog(true); }}
                      sx={{ textTransform:'none', fontSize:'0.75rem', borderColor: BRAND.blue, color: BRAND.blue }}>
                      View
                    </Button>
                  ) : (
                    <Typography variant="caption" color="text.disabled">—</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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