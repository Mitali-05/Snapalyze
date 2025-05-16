import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';

const OcrResults = ({ zipId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTextResults = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/zip/extract-text/${zipId}`);
        setResults(response.data.results);
      } catch (error) {
        console.error("Error fetching text extraction results:", error);
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

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Text Extraction Results for ZIP ID: {zipId}
      </Typography>
      {results.map((file, index) => (
        <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6">{file.filename}</Typography>
            <Typography variant="body2" whiteSpace="pre-wrap">
              {file.text || "No text extracted."}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default OcrResults;