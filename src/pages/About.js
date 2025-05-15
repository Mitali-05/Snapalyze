import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>About Snapalyze</h1>
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Snapalyze is a revolutionary AI-powered platform designed to transform how businesses and individuals extract information from images. Our cutting-edge technology combines advanced machine learning algorithms with intuitive user interfaces to deliver exceptional image analysis capabilities.
          </p>
          
          <h2 style={{ fontSize: '1.8rem', marginTop: '2.5rem', marginBottom: '1.5rem' }}>Our Mission</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Our mission is to make advanced AI image analysis accessible to everyone. We believe that the power of computer vision should not be limited to tech giants or specialized industries. By providing user-friendly tools and powerful APIs, we're democratizing access to AI-powered image analysis.
          </p>
          
          <h2 style={{ fontSize: '1.8rem', marginTop: '2.5rem', marginBottom: '1.5rem' }}>Our Team</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Founded by a team of AI researchers, software engineers, and business professionals, Snapalyze brings together diverse expertise to create a product that's both technically advanced and commercially viable. Our team members have backgrounds in computer vision, deep learning, user experience design, and enterprise software development.
          </p>
          
          <h2 style={{ fontSize: '1.8rem', marginTop: '2.5rem', marginBottom: '1.5rem' }}>Our Technology</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            At the core of Snapalyze is our proprietary deep learning engine that powers all our image analysis features. We've spent years training our models on diverse datasets to ensure they perform accurately across a wide range of image types and use cases. Our algorithms are continuously improving through active learning techniques that incorporate user feedback.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
