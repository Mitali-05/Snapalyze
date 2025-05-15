import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GetStarted = () => {
  return (
    <div className="get-started-page">
      <Navbar />
      <div className="container">
        <div className="get-started-content">
          <h1>Get Started with Snapalyze</h1>
          <p>Complete the form below to begin your AI image analysis journey.</p>
          
          <form className="get-started-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="company">Company Name (Optional)</label>
              <input type="text" id="company" name="company" />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GetStarted;
