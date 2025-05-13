import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
