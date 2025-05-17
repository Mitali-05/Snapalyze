import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';

const OcrResults = ({ zipId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTextResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token missing. Please login.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/zip/ocr/${zipId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResults(response.data.results || []);
      } catch (error) {
        console.error('Error fetching text extraction results:', error);
        setError(error.response?.data?.message || 'Failed to fetch text extraction results.');
      } finally {
        setLoading(false);
      }
    };

    if (zipId) {
      fetchTextResults();
    }
  }, [zipId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} mx={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      
           <Typography variant="h5" fontWeight="bold" gutterBottom>
             Text Extraction Results
           </Typography>
      {results.length === 0 ? (
        <Typography>No text extracted from the ZIP images.</Typography>
      ) : (
        results.map((file, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6">{file.filename}</Typography>
              <Typography variant="body2" whiteSpace="pre-wrap">
                {file.text || 'No text extracted.'}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default OcrResults;
