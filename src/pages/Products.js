import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const productStyles = {
  productCard: {
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#fff',
    marginBottom: '2rem'
  },
  productTitle: {
    fontSize: '1.8rem',
    marginBottom: '1rem'
  },
  productDescription: {
    color: '#555',
    marginBottom: '1.5rem',
    lineHeight: 1.6
  },
  featuresList: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '1.5rem'
  },
  featureItem: {
    padding: '0.5rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  featureIcon: {
    color: '#646cff',
    flex: '0 0 20px'
  }
};

const Products = () => {
  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Our Products</h1>
        
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Product 1 */}
          <div style={productStyles.productCard}>
            <h2 style={productStyles.productTitle}>Snapalyze Core</h2>
            <p style={productStyles.productDescription}>
              Our flagship product provides comprehensive image analysis capabilities through an intuitive web interface. Upload images and receive detailed analysis in seconds.
            </p>
            
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Key Features:</h3>
            <ul style={productStyles.featuresList}>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>Advanced object and scene recognition</span>
              </li>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>Text extraction from images (OCR)</span>
              </li>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>Facial recognition and analysis</span>
              </li>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>Color scheme analysis</span>
              </li>
            </ul>
          </div>
          
          {/* Product 2 */}
          <div style={productStyles.productCard}>
            <h2 style={productStyles.productTitle}>Snapalyze API</h2>
            <p style={productStyles.productDescription}>
              Integrate our powerful image analysis capabilities directly into your applications with our comprehensive API offering.
            </p>
            
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Key Features:</h3>
            <ul style={productStyles.featuresList}>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>RESTful API endpoints for all core features</span>
              </li>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>SDK libraries for popular programming languages</span>
              </li>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>Webhook integrations</span>
              </li>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>Comprehensive API documentation</span>
              </li>
            </ul>
          </div>
          
          {/* Product 3 */}
          <div style={productStyles.productCard}>
            <h2 style={productStyles.productTitle}>Snapalyze Enterprise</h2>
            <p style={productStyles.productDescription}>
              A complete solution for large organizations with advanced security, administrative controls, and dedicated support.
            </p>
            
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Key Features:</h3>
            <ul style={productStyles.featuresList}>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>On-premises deployment options</span>
              </li>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>Advanced user management and access controls</span>
              </li>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>Custom model training for specific use cases</span>
              </li>
              <li style={productStyles.featureItem}>
                <span style={productStyles.featureIcon}>✓</span>
                <span>SLA with 24/7 premium support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;