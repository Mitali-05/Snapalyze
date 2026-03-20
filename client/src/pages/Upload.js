import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Button, Grid, Paper, Typography, Stack, Divider,
  Card, CardContent, CircularProgress, TextField, InputAdornment,
  Chip, Tooltip, IconButton, Alert,
} from '@mui/material';
import SearchIcon      from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon    from '@mui/icons-material/Download';
import DeleteIcon      from '@mui/icons-material/Delete';
import FolderIcon      from '@mui/icons-material/Folder';
import Swal            from 'sweetalert2';

import ClassifyResults from './ClassifyResults';
import OcrResults      from './OcrResults';
import AnalysisResults from './AnalysisResults';
import Header, { CONTENT_MAX } from '../components/Header';
import PageWrapper     from '../components/PageWrapper';
import useToast        from '../hooks/useToast';
import ToastSnackbar   from '../components/ToastSnackbar';
import { BRAND }       from '../theme/theme';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ── Same container width as Dashboard header ────────────────────────────────
const PageContent = ({ children }) => (
  <Box sx={{ maxWidth: CONTENT_MAX, width: '100%', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
    {children}
  </Box>
);

export default function Upload() {
  const location  = useLocation();
  const { toast, toastState, handleClose } = useToast();

  const [zipId,       setZipId]       = useState(location.state?.zipId || null);
  const [message,     setMessage]     = useState('');
  const [uploading,   setUploading]   = useState(false);
  const [view,        setView]        = useState(null);
  const [activeView,  setActiveView]  = useState('dashboard');
  const [history,     setHistory]     = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard`, { headers: authHeader });
      setHistory(res.data.uploads || []);
    } catch { /* silent */ }
  }, []); // eslint-disable-line

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // If a zipId was passed from Dashboard history, auto-load it
  useEffect(() => {
    if (location.state?.zipId) {
      setZipId(location.state.zipId);
      toast.info('Previous upload loaded — choose an action below.');
    }
  }, []); // eslint-disable-line

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    setUploading(true); setMessage('');
    const fd = new FormData();
    fd.append('file', acceptedFiles[0]);
    try {
      const res = await axios.post(`${API_URL}/api/zip/upload`, fd, { headers: authHeader });
      setZipId(res.data.zipId);
      setView(null);
      setMessage(res.data.message);
      toast.success(res.data.message);
      fetchHistory();
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed.';
      setMessage(msg);
      if (err.response?.status === 429) toast.warning(msg);
      else toast.error(msg);
    } finally { setUploading(false); }
  }, [fetchHistory]); // eslint-disable-line

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/zip': ['.zip'] }, maxFiles: 1,
  });

  // Download all extracted text as .txt
  const handleDownloadText = async () => {
    if (!zipId) return;
    try {
      const res = await axios.get(`${API_URL}/api/zip/ocr/${zipId}`, { headers: authHeader });
      const content = (res.data.results || [])
        .map((r) => `${'='.repeat(60)}\n${r.filename}\n${'='.repeat(60)}\n${r.text || '[No text detected]'}\n`)
        .join('\n');
      const a = Object.assign(document.createElement('a'), {
        href:     URL.createObjectURL(new Blob([content], { type: 'text/plain' })),
        download: `extracted-text-${zipId}.txt`,
      });
      a.click(); URL.revokeObjectURL(a.href);
      toast.success('Text file downloaded!');
    } catch { toast.error('Download failed.'); }
  };

  // Delete single history entry
  const handleDeleteHistoryItem = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete this upload?',
      html: `<b>${name}</b>`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#e53935', confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_URL}/api/zip/${id}`, { headers: authHeader });
      if (zipId === id) { setZipId(null); setView(null); }
      toast.success('Deleted');
      fetchHistory();
    } catch { toast.error('Delete failed.'); }
  };

  const filteredHistory = history.filter((z) =>
    z.originalFileName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUploadView = () => (
    <>
      {/* Upload zone + actions row */}
      <Grid container spacing={3} alignItems="stretch" sx={{ mb: 5 }}>
        {/* Drop zone */}
        <Grid item xs={12} md={5}>
          <Paper
            {...getRootProps()}
            elevation={0}
            sx={{
              p: 5, textAlign: 'center', cursor: 'pointer', height: '100%',
              border: `2px dashed ${isDragActive ? BRAND.blue : BRAND.border}`,
              bgcolor: isDragActive ? `${BRAND.blue}08` : '#fff',
              borderRadius: 3,
              transition: 'all 0.2s ease',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2,
              '&:hover': { borderColor: BRAND.blue, bgcolor: `${BRAND.blue}06` },
            }}
          >
            <input {...getInputProps()} />
            <Box sx={{
              width: 72, height: 72, borderRadius: 3, mx: 'auto',
              background: isDragActive
                ? `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})`
                : `${BRAND.blue}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              <CloudUploadIcon sx={{ fontSize: 36, color: isDragActive ? '#fff' : BRAND.blue }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color={isDragActive ? BRAND.blue : BRAND.navy}>
              {isDragActive ? 'Drop your ZIP here' : 'Upload a ZIP file'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag & drop or click to browse · ZIP files only
            </Typography>
            <Button
              variant="contained" size="large" disabled={uploading}
              sx={{ alignSelf: 'center', px: 4 }}
            >
              {uploading ? <CircularProgress size={22} color="inherit" /> : 'Select File'}
            </Button>
            {message && (
              <Alert
                severity={
                  message.toLowerCase().includes('stored') ? 'success'
                  : message.toLowerCase().includes('limit') || message.toLowerCase().includes('failed') ? 'error'
                  : 'info'
                }
                sx={{ borderRadius: 2, textAlign: 'left' }}
              >
                {message}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item md={1} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <Divider orientation="vertical" flexItem />
        </Grid>

        {/* Actions panel */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{
            p: 4, height: '100%', borderRadius: 3,
            border: `1px solid ${BRAND.border}`, bgcolor: '#fff',
          }}>
            <Typography variant="h6" fontWeight={700} color={BRAND.navy} gutterBottom>
              Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {zipId
                ? 'ZIP ready — select an action to process your images.'
                : 'Upload a ZIP file or pick a previous upload from history to get started.'}
            </Typography>

            <Stack spacing={2}>
              <Button
                variant="contained" color="primary" size="large" fullWidth
                disabled={!zipId} onClick={() => setView('analysis')}
                sx={{ py: 1.4 }}
              >
                🔍&nbsp; Analyze Images
              </Button>
              <Button
                variant="contained" color="secondary" size="large" fullWidth
                disabled={!zipId} onClick={() => setView('classify')}
                sx={{ py: 1.4 }}
              >
                🏷️&nbsp; Classify Images
              </Button>
              <Button
                variant="contained" size="large" fullWidth
                disabled={!zipId} onClick={() => setView('ocr')}
                sx={{
                  py: 1.4,
                  background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.tealLight})`,
                  '&:hover': { background: `linear-gradient(135deg, ${BRAND.tealLight}, ${BRAND.teal})` },
                }}
              >
                📝&nbsp; Extract Text (OCR)
              </Button>

              {zipId && view === 'ocr' && (
                <Button
                  variant="outlined" size="large" fullWidth
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadText}
                  sx={{ borderColor: BRAND.teal, color: BRAND.teal, py: 1.2 }}
                >
                  Download Extracted Text (.txt)
                </Button>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Results */}
      {zipId && (
        <Box>
          {view === 'analysis' && <AnalysisResults zipId={zipId} />}
          {view === 'ocr'      && <OcrResults zipId={zipId} />}
          {view === 'classify' && <ClassifyResults zipId={zipId} />}
        </Box>
      )}

      {/* Upload history with search */}
      {history.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FolderIcon sx={{ color: BRAND.teal }} />
              <Typography variant="h6" fontWeight={700} color={BRAND.navy}>Previous Uploads</Typography>
              <Chip label={history.length} size="small" color="primary" variant="outlined" />
            </Box>
            <TextField
              size="small" placeholder="Search by filename…"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
              sx={{ width: 240 }}
            />
          </Box>

          <Grid container spacing={2}>
            {filteredHistory.map((zip) => (
              <Grid item xs={12} sm={6} md={4} key={zip._id}>
                <Card
                  variant="outlined"
                  onClick={() => { setZipId(zip._id); setView(null); toast.info(`Loaded: ${zip.originalFileName}`); }}
                  sx={{
                    cursor: 'pointer',
                    borderColor: zipId === zip._id ? BRAND.blue : BRAND.border,
                    transition: 'all 0.18s',
                    '&:hover': { borderColor: BRAND.blue, boxShadow: `0 4px 16px ${BRAND.blue}22` },
                  }}
                >
                  <CardContent sx={{ py: '12px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap sx={{ color: BRAND.navy }}>
                        {zip.originalFileName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.75, mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip label={`${zip.images?.length || 0} images`} size="small" color="primary" variant="outlined" />
                        <Chip label={new Date(zip.uploadedAt).toLocaleDateString()} size="small" />
                        {zipId === zip._id && <Chip label="Active" size="small" color="success" />}
                      </Box>
                    </Box>
                    <Tooltip title="Delete this upload">
                      <IconButton
                        size="small" color="error"
                        onClick={(e) => { e.stopPropagation(); handleDeleteHistoryItem(zip._id, zip.originalFileName); }}
                        sx={{ ml: 1, flexShrink: 0 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {filteredHistory.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">No uploads match your search.</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </>
  );

  return (
    <PageWrapper>
      <Header setActiveView={setActiveView} />
      <PageContent>
        {activeView === 'dashboard' && renderUploadView()}
      </PageContent>
      <ToastSnackbar state={toastState} onClose={handleClose} />
    </PageWrapper>
  );
}