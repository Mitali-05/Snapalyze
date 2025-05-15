import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaFileArchive } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import logo from './assests/logo.jpg';
import { useNavigate } from 'react-router-dom'; 
function Dashboard() {
  const [zipFiles, setZipFiles] = useState([]);
  const [usedSpace, setUsedSpace] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const MAX_STORAGE = 100 * 1024 * 1024;

  useEffect(() => {
    fetch('http://localhost:5000/api/zips/files')
      .then(res => res.json())
      .then(data => {
        setZipFiles(data);
        const totalUsed = data.reduce((sum, file) => sum + file.fileSize, 0);
        setUsedSpace(Math.min((totalUsed / MAX_STORAGE) * 100, 100));
      })
      .catch(err => console.error('Error fetching zip files:', err));
  }, []);
const navigate = useNavigate(); 
  const handleLogout = () => {
    alert('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');

  };

  const handlePricing = () => {
    alert('Redirecting to pricing...');
    navigate('/pricing');
  };

  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
    backgroundColor: '#f8f9fa',
    overflow: 'hidden'
  };

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    right: sidebarOpen ? 0 : '-250px',
    height: '100%',
    width: '250px',
    backgroundColor: '#343a40',
    color: '#fff',
    transition: 'right 0.3s ease-in-out',
    padding: '20px',
    zIndex: 1000
  };

  const sidebarItemStyle = {
    padding: '15px 10px',
    fontSize: '18px',
    cursor: 'pointer',
    borderBottom: '1px solid #495057'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const profileButtonStyle = {
    fontSize: '30px',
    cursor: 'pointer'
  };

  const headingStyle = {
    textAlign: 'center',
    margin: '20px 0',
    fontSize: '28px',
    fontWeight: 'bold'
  };

  const progressSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px'
  };

  const fileListStyle = {
    marginBottom: '30px'
  };

  const fileItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px'
  };

  const uploadButtonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={sidebarItemStyle} onClick={handlePricing}>Pricing</div>
        <div style={sidebarItemStyle} onClick={handleLogout}>Logout</div>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && <div style={overlayStyle} onClick={() => setSidebarOpen(false)}></div>}

      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 'bold' }}>
          <img src={logo} alt="Logo" style={{ width: '70px', height: '60px' }} />
          Snapalyze
        </div>
        <FaUserCircle style={profileButtonStyle} onClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <h2 style={headingStyle}>DASHBOARD</h2>

      <div style={progressSectionStyle}>
        <div style={{ width: '120px' }}>
          <CircularProgressbar
            value={usedSpace}
            text={`${Math.round(100 - usedSpace)}% Free`}
            styles={buildStyles({
              textSize: '14px',
              pathColor: '#00aaff',
              textColor: '#333',
              trailColor: '#eee',
            })}
          />
        </div>

        <div style={fileListStyle}>
          {zipFiles.map((file, idx) => (
            <div key={file._id || idx} style={fileItemStyle}>
              <FaFileArchive />
              <span>{`${idx + 1}: ${file.originalFileName}`}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        style={uploadButtonStyle}
        onClick={() => alert('Upload button clicked')}
      >
        Upload a new file
      </button>
    </div>
  );
}

export default Dashboard;
