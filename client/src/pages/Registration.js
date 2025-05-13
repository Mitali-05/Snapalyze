import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./registration.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

function Registration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).every((field) => field.trim() !== "")) {
      // Registration success
      navigate("/dashboard");
    } else {
      alert("Please fill all the fields");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>First Name</label>
            <div className="input-icon">
              <FaUser />
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <div className="input-icon">
              <FaUser />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Email</label>
            <div className="input-icon">
              <FaEnvelope />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit">REGISTER</button>
        </form>
        <p>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;
