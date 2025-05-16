import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button} from '@mui/material';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">DASHBOARD</div>
      {/* Add additional dashboard content here */}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/upload")}>
            Upload File
          </Button>
    </div>

    
  );
}

export default Dashboard;