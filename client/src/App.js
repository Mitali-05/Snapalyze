import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) {
      setMessage('⚠️ No file selected.');
      return;
    }

    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setMessage('');
      const res = await axios.post('http://localhost:5000/api/zip/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      console.error('❌ Upload error:', err);
      setMessage('❌ Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
  });

  return (
    <div className="App">
      <div className="upload-box" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="upload-content">
          <div className="upload-icon">📤</div>
          <h3>{isDragActive ? 'Drop the file here...' : 'Upload your file'}</h3>
          <p>Drag & drop an image or zip file here, or click to browse</p>
          <div className="file-types">
            <span>🖼️ Images</span> &nbsp; | &nbsp; <span>📁 Zip files</span>
          </div>
          <button className="upload-button">Select File</button>
        </div>
      </div>
      {loading && <p className="status-msg">⏳ Uploading...</p>}
      {message && <p className="status-msg">{message}</p>}
    </div>
  );
}

export default App;
