import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import Upload from './pages/Upload';
import GetStarted from './pages/GetStarted';
import AnalyzeText from './pages/AnalyzeText';
import TextExtraction from './pages/TextExtraction';
import ClassifyImages from './pages/ClassifyImages';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/analyze-text" element={<AnalyzeText />} />
        <Route path="/text-extraction" element={<TextExtraction />} />
        <Route path="/classify-images" element={<ClassifyImages />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
