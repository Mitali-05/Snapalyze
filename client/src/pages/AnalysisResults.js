import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  CircularProgress,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AnalysisResults = ({ zipId }) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/zip/analyze/${zipId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResults(res.data.analyzed);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [zipId]);

  const handleOpenImage = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Typography variant="body1" my={4} align="center">
        No analysis results found.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Analysis Results
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Filename</strong></TableCell>
              <TableCell align="right"><strong>Size (bytes)</strong></TableCell>
              <TableCell align="right"><strong>Dimensions (W x H)</strong></TableCell>
              <TableCell align="center"><strong>Contains Text</strong></TableCell>
              <TableCell align="right"><strong>Processing Time (ms)</strong></TableCell>
              <TableCell><strong>Image Preview</strong></TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((item, index) => (
              <TableRow key={index} hover>
                <TableCell>{item.filename}</TableCell>
                <TableCell align="right">{item.fileSize}</TableCell>
                <TableCell align="right">
                  {item.imageDimensions.width} x {item.imageDimensions.height}
                </TableCell>
                <TableCell align="center">{item.hasText ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">{item.processingTimeMs}</TableCell>
                <TableCell>
                  {item.imagePreview ? (
                    <Button variant="outlined" size="small" onClick={() => handleOpenImage(item.imagePreview)}>
                      View
                    </Button>
                  ) : (
                    <i>No preview</i>
                  )}
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Image Preview Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Image Preview
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedImage && (
            <img src={selectedImage} alt="preview" style={{ width: '100%', height: 'auto' }} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AnalysisResults;
