import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import Slider from 'react-slick';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const bannerImages = [
  {
    img: 'https://source.unsplash.com/1600x600/?data,technology',
    title: 'Data Analytics Made Easy',
    subtitle: 'Unlock insights with Snapalyze',
  },
  {
    img: 'https://source.unsplash.com/1600x600/?business,intelligence',
    title: 'Powerful Business Intelligence',
    subtitle: 'Make smarter decisions fast',
  },
  {
    img: 'https://source.unsplash.com/1600x600/?dashboard,analytics',
    title: 'Interactive Dashboards',
    subtitle: 'Visualize your data beautifully',
  },
];

const products = [
  {
    title: 'Image & Content Object Detection',
    description:
      'Detect and identify objects, people, and key elements within images with high precision using our state-of-the-art AI models.',
  },
  {
    title: 'Text Extraction',
    description:
      'Automatically extract and digitize text from images, enabling seamless data capture from documents, signs, and forms.',
  },
  {
    title: 'Image Classification',
    description:
      'Classify images into predefined categories quickly and accurately using deep learning models trained on diverse datasets.',
  },
];

const pricingStyles = {
  pricingContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
    marginTop: '3rem',
  },
  pricingCard: {
    width: '300px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  pricingHeader: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #eaeaea',
    textAlign: 'center',
  },
  pricingTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#333',
  },
  price: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#646cff',
    marginBottom: '0.5rem',
  },
  pricingPeriod: {
    color: '#666',
    fontSize: '0.9rem',
  },
  pricingBody: {
    padding: '1.5rem',
    backgroundColor: '#fff',
    flex: '1',
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  featureItem: {
    padding: '0.75rem 0',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  featureIcon: {
    color: '#646cff',
    flex: '0 0 16px',
  },
  pricingFooter: {
    padding: '1.5rem',
    backgroundColor: '#fff',
    textAlign: 'center',
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
    transition: 'background-color 0.3s',
  },
};

const pricingPlans = [
  {
    title: 'Basic',
    price: 'Free',
    period: 'Forever',
    features: [
      '50 image analyses per month',
      'Basic object recognition',
      'Text extraction (OCR)',
      'Community support',
    ],
    buttonText: 'Get Started',
    link: '/signup',
    headerBg: '#f8f9fa',
  },
  {
    title: 'Professional',
    price: '$29',
    period: 'per month',
    features: [
      '500 image analyses per month',
      'Advanced object recognition',
      'Full API access',
      'Email support',
    ],
    buttonText: 'Subscribe Now',
    link: '/signup',
    headerBg: '#f0f4ff',
  },
  {
    title: 'Enterprise',
    price: '$199',
    period: 'per month',
    features: [
      'Unlimited image analyses',
      'Custom AI models',
      'Dedicated support',
      'Onboarding assistance',
    ],
    buttonText: 'Contact Sales',
    link: '/contact',
    headerBg: '#f0f0ff',
  },
];

function Home() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
  };

  return (
    <Box>
      <Header />

      {/* Banner Slider */}
      <Box sx={{ position: 'relative', overflow: 'hidden', mb: 6 }}>
        <Slider {...sliderSettings}>
          {bannerImages.map(({ img, title, subtitle }, index) => (
            <Box
              key={index}
              sx={{
                height: { xs: 320, md: 520 },
                minHeight: 320,
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.7)), url(${img})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textAlign: 'center',
                px: 3,
                transition: 'all 0.5s ease-in-out',
              }}
            >
              <Box
                sx={{
                  p: { xs: 3, md: 6 },
                  borderRadius: 3,
                  maxWidth: 600,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3.5rem' },
                    letterSpacing: 1.5,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    fontWeight: 500,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    letterSpacing: 0.5,
                  }}
                >
                  {subtitle}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  sx={{
                    px: 5,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    boxShadow: 'none',
                    '&:hover': { boxShadow: '0 4px 15px rgba(25, 118, 210, 0.4)' },
                  }}
                  aria-label={`Learn more about ${title}`}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        {/* About Us */}
        <Box id="about" sx={{ scrollMarginTop: '80px', mb: 10 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}
          >
            About Us
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto', textAlign: 'center', lineHeight: 1.7 }}
          >
            Welcome to Snapalyze! We are dedicated to providing innovative solutions that help you analyze data quickly and efficiently.
            Our team consists of passionate professionals committed to delivering high-quality products tailored to your needs.
            Whether you're a small business or a large enterprise, Snapalyze offers tools designed to grow with you.
          </Typography>
        </Box>

        {/* Products - styled like pricing cards */}
        <Box id="products" sx={{ scrollMarginTop: '80px', mb: 12 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}
          >
            Our Products
          </Typography>
          <Box sx={pricingStyles.pricingContainer}>
            {products.map(({ title, description }, i)=> (
<Box key={i} sx={{ ...pricingStyles.pricingCard, backgroundColor: '#fff' }}>
<Box sx={pricingStyles.pricingHeader}>
<Typography variant="h5" sx={pricingStyles.pricingTitle}>{title}</Typography>
</Box>
<Box sx={pricingStyles.pricingBody}>
<Typography variant="body1" color="text.secondary">{description}</Typography>
</Box>
</Box>
))}
</Box>
</Box>
    {/* Pricing */}
    <Box id="pricing" sx={{ scrollMarginTop: '80px', mb: 12 }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}
      >
        Pricing
      </Typography>
      <Box sx={pricingStyles.pricingContainer}>
        {pricingPlans.map((plan, index) => (
          <Box key={index} sx={{ ...pricingStyles.pricingCard, backgroundColor: '#fff' }}>
            <Box sx={{ ...pricingStyles.pricingHeader, backgroundColor: plan.headerBg }}>
              <Typography sx={pricingStyles.pricingTitle}>{plan.title}</Typography>
              <Typography sx={pricingStyles.price}>{plan.price}</Typography>
              <Typography sx={pricingStyles.pricingPeriod}>{plan.period}</Typography>
            </Box>
            <Box sx={pricingStyles.pricingBody}>
              <ul style={pricingStyles.featuresList}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={pricingStyles.featureItem}>
                    ✅ {feature}
                  </li>
                ))}
              </ul>
            </Box>
            <Box sx={pricingStyles.pricingFooter}>
              <Link to={plan.link} style={pricingStyles.button}>
                {plan.buttonText}
              </Link>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Container>

  <Footer />
</Box>
);
}

export default Home;