import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          <div className="footer-logo">
            <img src="/placeholder.svg" alt="Snapalyze Logo" />
            <p>Powerful AI image analysis for everyone</p>
          </div>
          
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Products</h4>
            <ul>
              <li><Link to="/products">Features</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/api-docs">API Documentation</Link></li>
              <li><Link to="/tutorials">Tutorials</Link></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/security">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 Snapalyze. All rights reserved.</p>
          <div className="social-icons">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">T</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">F</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">L</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
