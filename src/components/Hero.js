import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Discover the Power of AI</h1>
            <p className="hero-description">
              Snapalyze is a cutting-edge AI-based tool that empowers users to extract valuable insights from their uploaded images. Our innovative platform provides a seamless and intuitive experience.
            </p>
            <Link to="/get-started" className="btn btn-primary">
              Get Started
              <span className="arrow-icon">→</span>
            </Link>
          </div>
          
          <div className="hero-image">
            <img 
              src="/placeholder.svg" 
              alt="Snapalyze Platform Demo"
            />
            <div className="hero-shape hero-shape-1"></div>
            <div className="hero-shape hero-shape-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
