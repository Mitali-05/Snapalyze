import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated");
    if (!isAuthenticated) {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">DASHBOARD</div>
      {/* Add additional dashboard content here */}
    </div>
  );
}

export default Dashboard;
