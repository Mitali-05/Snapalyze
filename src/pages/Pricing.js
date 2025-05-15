import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const pricingStyles = {
  pricingContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
    marginTop: '3rem'
  },
  pricingCard: {
    width: '300px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column'
  },
  pricingHeader: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #eaeaea',
    textAlign: 'center'
  },
  pricingTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#333'
  },
  price: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#646cff',
    marginBottom: '0.5rem'
  },
  pricingPeriod: {
    color: '#666',
    fontSize: '0.9rem'
  },
  pricingBody: {
    padding: '1.5rem',
    backgroundColor: '#fff',
    flex: '1'
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  featureItem: {
    padding: '0.75rem 0',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  featureIcon: {
    color: '#646cff',
    flex: '0 0 16px'
  },
  pricingFooter: {
    padding: '1.5rem',
    backgroundColor: '#fff',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#646cff',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '4px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background-color 0.3s'
  }
};

const Pricing = () => {
  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Pricing Plans</h1>
        <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem', color: '#666' }}>
          Choose the perfect plan for your needs. All plans include core image analysis features with varying levels of API access and support.
        </p>
        
        <div style={pricingStyles.pricingContainer}>
          {/* Free Plan */}
          <div style={pricingStyles.pricingCard}>
            <div style={pricingStyles.pricingHeader}>
              <h2 style={pricingStyles.pricingTitle}>Basic</h2>
              <div style={pricingStyles.price}>Free</div>
              <div style={pricingStyles.pricingPeriod}>Forever</div>
            </div>
            <div style={pricingStyles.pricingBody}>
              <ul style={pricingStyles.featuresList}>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>50 image analyses per month</span>
                </li>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>Basic object recognition</span>
                </li>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>Text extraction (OCR)</span>
                </li>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>Community support</span>
                </li>
              </ul>
            </div>
            <div style={pricingStyles.pricingFooter}>
              <Link to="/signup" style={pricingStyles.button}>Get Started</Link>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div style={pricingStyles.pricingCard}>
            <div style={{...pricingStyles.pricingHeader, backgroundColor: '#f0f4ff'}}>
              <h2 style={pricingStyles.pricingTitle}>Professional</h2>
              <div style={pricingStyles.price}>$29</div>
              <div style={pricingStyles.pricingPeriod}>per month</div>
            </div>
            <div style={pricingStyles.pricingBody}>
              <ul style={pricingStyles.featuresList}>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>500 image analyses per month</span>
                </li>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>Advanced object recognition</span>
                </li>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>Full API access</span>
                </li>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>Email support</span>
                </li>
              </ul>
            </div>
            <div style={pricingStyles.pricingFooter}>
              <Link to="/signup" style={pricingStyles.button}>Subscribe Now</Link>
            </div>
          </div>
          
          {/* Enterprise Plan */}
          <div style={pricingStyles.pricingCard}>
            <div style={{...pricingStyles.pricingHeader, backgroundColor: '#f0f0ff'}}>
              <h2 style={pricingStyles.pricingTitle}>Enterprise</h2>
              <div style={pricingStyles.price}>$199</div>
              <div style={pricingStyles.pricingPeriod}>per month</div>
            </div>
            <div style={pricingStyles.pricingBody}>
              <ul style={pricingStyles.featuresList}>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>Unlimited image analyses</span>
                </li>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>Custom model training</span>
                </li>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>Extended API rate limits</span>
                </li>
                <li style={pricingStyles.featureItem}>
                  <span style={pricingStyles.featureIcon}>✓</span>
                  <span>Priority 24/7 support</span>
                </li>
              </ul>
            </div>
            <div style={pricingStyles.pricingFooter}>
              <Link to="/contact" style={pricingStyles.button}>Contact Sales</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
