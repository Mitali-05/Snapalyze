import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <Logo />
        </Link>
        
        <div className="navbar-links">
          <Link to="/about">About Us</Link>
          <Link to="/products">Our Products</Link>
          <Link to="/pricing">Pricing</Link>
        </div>
        
        <div className="navbar-buttons">
          <Link to="/login" className="btn btn-outline">
            Login
          </Link>
          <Link to="/get-started" className="btn btn-primary">
            Get Started
            <span className="arrow-icon">→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
