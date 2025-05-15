import React from 'react';

const Logo = ({ className }) => {
  return (
    <div className={`logo-container ${className || ''}`}>
      <div className="logo-icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z" fill="#0A0A16" />
          <path d="M9 20C9 18.8954 9.89543 18 11 18H21C22.1046 18 23 18.8954 23 20V20C23 21.1046 22.1046 22 21 22H11C9.89543 22 9 21.1046 9 20V20Z" fill="white" />
          <path d="M9 12C9 10.8954 9.89543 10 11 10H21C22.1046 10 23 10.8954 23 12V12C23 13.1046 22.1046 14 21 14H11C9.89543 14 9 13.1046 9 12V12Z" fill="white" />
        </svg>
      </div>
       <span className="logo-text">Snapalyze</span>
    </div>
  );
};

export default Logo;