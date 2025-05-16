// // import React, { useState, useCallback } from 'react';
// // import { useDropzone } from 'react-dropzone';
// // import axios from 'axios';
// // import './upload.css';

// // function Upload() {
// //   const [message, setMessage] = useState('');
// //   const [zipId, setZipId] = useState(null);
// //   const [results, setResults] = useState(null); // State to store results

// //   const onDrop = useCallback(async (acceptedFiles) => {
// //     const formData = new FormData();
// //     formData.append('file', acceptedFiles[0]);

// //     try {
// //       const res = await axios.post('/api/zip/upload', formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });

// //       setMessage(res.data.message);
// //       setZipId(res.data.zipId);
// //     } catch (err) {
// //       setMessage('Upload failed.');
// //       setZipId(null);
// //     }
// //   }, []);

// //   const { getRootProps, getInputProps } = useDropzone({
// //     onDrop,
// //     accept: {
// //       'image/*': [],
// //       'application/zip': ['.zip'],
// //     },
// //     maxFiles: 1,
// //   });

// //   const handleExtractText = async () => {
// //     const response = await ocrResult(zipId);
// //     setResults(response);
// //   };

// //   const handleClassifyImages = async () => {
// //     const response = await classifyResults(zipId);
// //     setResults(response);
// //   };

// //   const ocrResult = async (zipId) => {
// //     const response = await axios.get(`/api/ocr/${zipId}`);
// //     return response.data;
// //   };

// //   const classifyResults = async (zipId) => {
// //     const response = await axios.get(`/api/classify/${zipId}`);
// //     return response.data;
// //   };

// //   return (
// //     <div className="upload-container">
// //       <div className="upload-header">
// //         <h1>Snapalyze</h1>
// //       </div>
// //       <div className="upload-box" {...getRootProps()}>
// //         <input {...getInputProps()} />
// //         <div className="upload-instruction">
// //           <p>Upload a single .zip file</p>
// //           <button className="select-button">Select File</button>
// //         </div>
// //       </div>

// //       {message && <p className="status-msg">{message}</p>}

// //       {zipId && (
// //         <div className="button-group">
// //           <button onClick={handleExtractText}>Extract Text →</button>
// //           <button onClick={handleClassifyImages}>Analyze Images →</button>
// //           <button onClick={handleClassifyImages}>Classify Images →</button>
// //         </div>
// //       )}

// //       {results && (
// //         <div className="results-section">
// //           <h3>Results:</h3>
// //           <pre>{JSON.stringify(results, null, 2)}</pre>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default Upload;
// import React, { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';
// import './upload.css';
// import ClassifyResults from './ClassifyResults';
// import OcrResults from './OcrResults';

// function Upload() {
//   const [message, setMessage] = useState('');
//   const [zipId, setZipId] = useState(null);  // 🌟 New state for storing zipId

//   const onDrop = useCallback(async (acceptedFiles) => {
//     const formData = new FormData();
//     formData.append('file', acceptedFiles[0]);

//     try {
//       const res = await axios.post('http://localhost:5000/api/zip/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setMessage(res.data.message);
//       setZipId(res.data.zipId);  // 🌟 Store the zipId received from backend
//     } catch (err) {
//       setMessage('Upload failed.');
//       setZipId(null); // Reset on error
//     }
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: {
//       'image/*': [],
//       'application/zip': ['.zip'],
//     },
//     maxFiles: 1,
//   });

//   return (
//     <div className="App">
//       <div className="upload-box" {...getRootProps()}>
//         <input {...getInputProps()} />
//         <div className="upload-content">
//           <div className="upload-icon">📤</div>
//           <h3>Upload your file</h3>
//           <p>Drag and drop an image or zip file here, or click to browse</p>
//           <div className="file-types">
//             <span>🖼️ Images</span> &nbsp; | &nbsp; <span>📁 Zip files</span>
//           </div>
//           <button className="upload-button">Select File</button>
//         </div>
//       </div>

//       {message && <p className="status-msg">{message}</p>}

//       {/* Pass zipId as prop to both components */}
//       {zipId && (
//         <>
//           <ClassifyResults zipId={zipId} />
//           <OcrResults zipId={zipId} />
//         </>
//       )}
//     </div>
//   );
// }

// export default Upload;

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import ClassifyResults from './ClassifyResults';
import OcrResults from './OcrResults';

function Upload() {
  const [message, setMessage] = useState('');
  const [zipId, setZipId] = useState(null);
  const [view, setView] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    try {
      const res = await axios.post('http://localhost:5000/api/zip/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(res.data.message);
      setZipId(res.data.zipId);
      console.log('Upload success:', res.data);
    } catch (err) {
      setMessage('Upload failed.');
      setZipId(null);
      setView(null);
      console.error('Upload error:', err);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/zip': ['.zip'] },
    maxFiles: 1,
  });

  const handleExtractText = () => setView('ocr');
  const handleClassifyImages = () => setView('classify');

  return (
    <Box p={4} maxWidth="900px" mx="auto">
      <Typography variant="h3" fontWeight="bold" gutterBottom align="center" sx={{ mb: 6 }}>
        Snapalyze
      </Typography>

      <Grid container spacing={5}>
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Paper
            {...getRootProps()}
            elevation={isDragActive ? 12 : 3}
            sx={{
              p: 5,
              textAlign: 'center',
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.400',
              bgcolor: isDragActive ? 'primary.light' : 'background.paper',
              cursor: 'pointer',
              height: '100%',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 2,
              borderRadius: 2,
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="h6" fontWeight="medium">
              {isDragActive ? 'Drop your .zip file here...' : 'Upload a .zip file'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag & drop or click to select
            </Typography>
            <Button variant="contained" size="large" sx={{ mt: 2 }}>
              Select File
            </Button>
            {message && (
              <Typography
                sx={{ mt: 3, fontWeight: 'medium' }}
                color={message.toLowerCase().includes('failed') ? 'error' : 'success.main'}
              >
                {message}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Actions Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 5, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Actions
            </Typography>

            <Stack spacing={3} mt={3}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={!zipId}
                onClick={handleExtractText}
                fullWidth
              >
                Extract Text
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="large"
                disabled={!zipId}
                onClick={handleClassifyImages}
                fullWidth
              >
                Classify Images
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Results Section */}
      <Box mt={6}>
        <Divider sx={{ mb: 4 }} />
        {zipId && view === 'ocr' && <OcrResults zipId={zipId} />}
        {zipId && view === 'classify' && <ClassifyResults zipId={zipId} />}
      </Box>
    </Box>
  );
}

export default Upload;