import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, CircularProgress, Alert, Button, Chip, Paper,
  Dialog, DialogTitle, DialogContent, IconButton, Divider, Skeleton,
} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ImageIcon       from '@mui/icons-material/Image';
import CloseIcon       from '@mui/icons-material/Close';
import DownloadIcon    from '@mui/icons-material/Download';
import PhotoIcon       from '@mui/icons-material/Photo';
import { BRAND }       from '../theme/theme';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function OcrResults({ zipId }) {
  const [results,        setResults]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
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
        const res = await axios.get(`${API_URL}/api/zip/ocr/${zipId}`, { headers: authHeader });
        setResults(res.data.results || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch OCR results.');
      } finally { setLoading(false); }
    };
    fetch();
  }, [zipId]);

  const handleViewImage = async (filename) => {
    setPreviewLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/zip/analyze/${zipId}`, { headers: authHeader });
      const match = res.data.analyzed?.find((img) => img.filename === filename);
      if (match?.imagePreview) {
        setSelectedImage(match.imagePreview);
        setSelectedName(filename);
        setOpenDialog(true);
      }
    } catch {} finally { setPreviewLoading(false); }
  };

  const handleDownloadSingle = (filename, text) => {
    const a = Object.assign(document.createElement('a'), {
      href:     URL.createObjectURL(new Blob(
        [`${filename}\n${'─'.repeat(40)}\n\n${text || '[No text detected]'}`],
        { type: 'text/plain' }
      )),
      download: `${filename.replace(/\.[^.]+$/, '')}-text.txt`,
    });
    a.click(); URL.revokeObjectURL(a.href);
  };

  if (loading) return (
    <Box>
      <Typography variant="h5" fontWeight={700} color={BRAND.navy} gutterBottom>Text Extraction Results</Typography>
      {[1,2,3].map((i) => (
        <Paper key={i} variant="outlined" sx={{ mb: 2, borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: 'grey.50' }}><Skeleton width="45%" height={24} /></Box>
          <Box sx={{ p: 2 }}><Skeleton height={70} /></Box>
        </Paper>
      ))}
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!results.length) return (
    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
      No results found.
    </Typography>
  );

  const textCount    = results.filter((r) => r.text?.trim().length > 0).length;
  const skippedCount = results.filter((r) => r.skipped).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb: 2.5, flexWrap:'wrap', gap: 1 }}>
        <Typography variant="h5" fontWeight={700} color={BRAND.navy}>Text Extraction Results</Typography>
        <Box sx={{ display:'flex', gap: 1 }}>
          <Chip label={`${textCount} with text`} size="small" color="primary" variant="outlined" />
          {skippedCount > 0 && (
            <Chip label={`${skippedCount} photos skipped`} size="small" color="default" variant="outlined" />
          )}
        </Box>
      </Box>

      {skippedCount > 0 && (
        <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
          <strong>{skippedCount} image{skippedCount !== 1 ? 's were' : ' was'} automatically detected as photos or artwork</strong> and skipped — photos rarely contain meaningful text, and running OCR on them wastes time and produces garbage output.
        </Alert>
      )}

      {results.map((file, idx) => {
        const hasText  = file.text?.trim().length > 0;
        const skipped  = file.skipped === true;

        return (
          <Paper key={idx} variant="outlined" sx={{
            mb: 2.5, borderRadius: 3, overflow: 'hidden',
            borderColor: hasText ? BRAND.teal : skipped ? '#e8eaf6' : BRAND.border,
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: `0 4px 20px ${BRAND.blue}18` },
          }}>
            {/* Card header */}
            <Box sx={{
              px: 2.5, py: 1.5,
              bgcolor: hasText ? `${BRAND.teal}10` : skipped ? '#f8f9fe' : 'grey.50',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              flexWrap:'wrap', gap: 1,
              borderBottom: `1px solid ${BRAND.border}`,
            }}>
              <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
                {skipped
                  ? <PhotoIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  : <TextSnippetIcon fontSize="small" sx={{ color: hasText ? BRAND.teal : 'text.disabled' }} />
                }
                <Typography variant="subtitle2" fontWeight={700} color={BRAND.navy} noWrap sx={{ maxWidth: 300 }}>
                  {file.filename}
                </Typography>

                {skipped ? (
                  <Chip label="Photo — OCR skipped" size="small" variant="outlined"
                    sx={{ borderColor: '#9e9e9e', color: '#757575', fontSize: '0.7rem' }} />
                ) : (
                  <Chip
                    label={hasText ? 'Text Found' : 'No Text'}
                    size="small" variant="outlined"
                    sx={{
                      borderColor: hasText ? BRAND.teal : BRAND.border,
                      color: hasText ? BRAND.teal : 'text.secondary',
                    }}
                  />
                )}

                {!skipped && file.confidence > 0 && (
                  <Chip
                    label={`${file.confidence.toFixed(0)}% confidence`}
                    size="small" variant="outlined"
                    color={file.confidence > 70 ? 'primary' : 'warning'}
                  />
                )}
              </Box>

              <Box sx={{ display:'flex', gap: 1 }}>
                {hasText && (
                  <Button size="small" startIcon={<DownloadIcon fontSize="small" />}
                    onClick={() => handleDownloadSingle(file.filename, file.text)}
                    sx={{ textTransform:'none', fontSize:'0.78rem', color: BRAND.teal }}>
                    Save
                  </Button>
                )}
                <Button size="small" variant="outlined"
                  startIcon={<ImageIcon fontSize="small" />}
                  onClick={() => handleViewImage(file.filename)}
                  disabled={previewLoading}
                  sx={{ textTransform:'none', fontSize:'0.78rem', borderColor: BRAND.blue, color: BRAND.blue }}>
                  View Image
                </Button>
              </Box>
            </Box>

            {/* Body */}
            <Box sx={{ px: 2.5, py: 2 }}>
              {skipped ? (
                
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  p: 2, borderRadius: 2, bgcolor: '#f8f9fe',
                  border: `1px dashed #c5cae9`,
                }}>
                  <PhotoIcon sx={{ color: '#9e9e9e', fontSize: 32, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      Detected as a photo or artwork
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      OCR was skipped automatically. Click "View Image" to confirm.
                      If this image does have text, please ensure the image has clear black text on a light background.
                    </Typography>
                  </Box>
                </Box>
              ) : hasText ? (
                /* Extracted text */
                <Box sx={{
                  bgcolor: '#f7fafa', border: `1px solid ${BRAND.border}`,
                  borderRadius: 2, p: 2,
                }}>
                  <Typography component="pre" sx={{
                    fontFamily: '"Roboto Mono", monospace',
                    fontSize: '0.85rem', lineHeight: 1.8,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    color: BRAND.navy, m: 0,
                  }}>
                    {file.text}
                  </Typography>
                </Box>
              ) : (
                
                <Typography variant="body2" color="text.disabled" fontStyle="italic">
                  No readable text detected. The image may be too blurry, have very small text, or use a non-English language.
                </Typography>
              )}
            </Box>
          </Paper>
        );
      })}

      {/* Image preview dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pr: 6, color: BRAND.navy, fontWeight: 700 }}>
          {selectedName}
          <IconButton onClick={() => setOpenDialog(false)}
            sx={{ position:'absolute', right:8, top:8, color:'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedImage && (
            <img src={selectedImage} alt="preview"
              style={{ width:'100%', height:'auto', borderRadius: 8 }} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}