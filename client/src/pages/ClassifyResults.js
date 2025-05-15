import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';

const classLabels = ["Education", "Medical", "Jobs", "Bills", "Other"]; // Update based on your model

const ClassifyResults = ({ zipId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/zip/classify/${zipId}`);
        setResults(res.data.results);
      } catch (err) {
        console.error("Error fetching classification:", err);
      } finally {
        setLoading(false);
      }
    };

    if (zipId) {
      fetchClassifications();
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
        Classification Results for ZIP ID: {zipId}
      </Typography>
      {results.map((img, index) => (
        <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6">{img.filename}</Typography>
            <Typography>
              Prediction: <strong>{classLabels[img.prediction]}</strong>
            </Typography>
            <Typography>
              Confidence: {(img.confidence * 100).toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ClassifyResults;
