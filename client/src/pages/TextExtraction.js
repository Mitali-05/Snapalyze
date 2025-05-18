import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const TextExtraction = ({ zipId }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const fetchResults = useCallback(async () => {
  if (!zipId) return;

  const token = localStorage.getItem('token');
  if (!token) {
    setError('Authentication token missing. Please login.');
    return;
  }

  setLoading(true);
  setError(null);
  try {
    const response = await axios.get(`http://localhost:5000/api/zip/ocr/${zipId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setResults(response.data);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to fetch text extraction results.');
  } finally {
    setLoading(false);
  }
}, [zipId]);


  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  if (!zipId) return <p>Please upload a ZIP file first.</p>;

  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h2>Text Extraction Results</h2>
      <button onClick={fetchResults} disabled={loading} style={{ marginBottom: 10 }}>
        {loading ? 'Refreshing...' : 'Refresh Results'}
      </button>
      {loading && <p>Loading OCR results...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results ? (
        <>
          <p><strong>ZIP ID:</strong> {results.zipId}</p>
          <p><strong>Total Images Processed:</strong> {results.totalImages}</p>
          {results.results && results.results.length > 0 ? (
            <div>
              {results.results.map(({ filename, text }, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '1rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid #ccc',
                    backgroundColor: '#f9f9f9',
                    borderRadius: 4,
                  }}
                >
                  <h4>{filename}</h4>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {text || '[No text detected]'}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <p>No extracted text found in ZIP images.</p>
          )}
        </>
      ) : null}
    </div>
  );
};

export default TextExtraction;
