import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      // Mock authentication
      localStorage.setItem("authenticated", true);
      navigate("/dashboard");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <div className="input-icon">
              <FaUser />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-icon">
              <FaLock />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit">LOGIN</button>
        </form>
        <p>
          Need an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
