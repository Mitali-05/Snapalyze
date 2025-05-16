import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CircularProgress,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from '@mui/material';

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Filename</strong></TableCell>
              <TableCell><strong>Top Label</strong></TableCell>
              <TableCell><strong>Confidence</strong></TableCell>
              <TableCell><strong>Top 3 Predictions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((img, index) => (
              <TableRow key={index}>
                <TableCell>{img.filename}</TableCell>
                <TableCell>{img.predictions?.[0]?.label || 'N/A'}</TableCell>
                <TableCell>
                  {img.predictions?.[0]
                    ? `${(img.predictions[0].confidence * 100).toFixed(2)}%`
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {img.predictions?.length ? (
                    img.predictions.map((pred, i) => (
                      <div key={i}>
                        {pred.label}: {(pred.confidence * 100).toFixed(2)}%
                      </div>
                    ))
                  ) : (
                    <div>N/A</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClassifyResults;