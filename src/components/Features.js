import React from 'react';
const features = [
  {
    title: "Image Recognition",
    description: "Advanced AI algorithms that can identify objects, scenes, and patterns in your images"
  },
  {
    title: "Text Extraction",
    description: "Extract and analyze text within images for document processing and information retrieval"
  },
  {
    title: "Sentiment Analysis",
    description: "Understand the emotional content and sentiment conveyed in visual media"
  },
  {
    title: "Object Detection",
    description: "Precisely locate and identify multiple objects within a single image"
  },
  {
    title: "Classification",
    description: "Categorize images automatically based on their content and visual characteristics"
  },
  {
    title: "Data Insights",
    description: "Generate actionable insights from visual data to inform business decisions"
  }
];

const Features = () => {
  return (
  <section className="features">
      <div className="container">
        <h2 className="section-title">Snapalyze Features</h2>
        <p className="section-description" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
          Snapalyze offers a comprehensive suite of AI-driven image analysis tools that empower you to unlock the full potential of your visual data
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
