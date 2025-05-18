import React from 'react';
import { Box, Container,Divider, Typography, Button } from '@mui/material';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
    title: 'Discover the Power of AI',
    subtitle: 'Snapalyze is a cutting-edge AI-based tool that empowers users to extract valuable insights from their uploaded images. Our innovative platform provides a seamless and intuitive experience.',
  },
  {
    img: 'https://source.unsplash.com/1600x600/?dashboard,analytics',
    title: 'Interactive Dashboards',
    subtitle: 'Visualize your data beautifully',
  },
];



const features = [
  {
    title: "Image Recognition",
    description: [
      "Identify objects",
      "Recognize scenes",
      "Detect patterns in images",
    ],
  },
  {
    title: "Text Extraction",
    description: [
      "Extract text from images",
      "Analyze document content",
      "Retrieve useful information",
    ],
  },
  {
    title: "Sentiment Analysis",
    description: [
      "Detect emotional content",
      "Analyze sentiment in visuals",
    ],
  },
  {
    title: "Object Detection",
    description: [
      "Locate multiple objects",
      "Identify objects precisely",
    ],
  },
  {
    title: "Classification",
    description: [
      "Automatically categorize images",
      "Based on content and visuals",
    ],
  },
  {
    title: "Data Insights",
    description: [
      "Generate actionable insights",
      "Support business decisions",
    ],
  },
];

const pricingPlans = [
  {
    title: 'Basic',
    price: 'Free',
    period: 'Forever',
    features: [
      '2 images analyses per day',
      'Basic object recognition',
      'Text extraction (OCR)',
      'Community support',
    ],
    buttonText: 'Get Started',
    link: '/login',  // changed from '/signup' to '/login'
    headerBg: '#f8f9fa',
  },
  {
    title: 'Professional',
    price: '$29',
    period: 'per month',
    features: [
      '200 image analyses per month',
      'Advanced object recognition',
      'Full API access',
      'Email support',
    ],
    buttonText: 'Subscribe Now',
    link: '/login', // changed to '/login'
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
    buttonText: 'Subscribe Now',
    link: '/login', // changed to '/login'
    headerBg: '#f0f0ff',
  },
];


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

export default function Home() {
  return (
    <Box>
      <Header />

      {/* Banner Section */}
      {/* Banner Section */}
{/* Banner Section */}
<Box sx={{ mb: 8 }}>
  <Slider {...sliderSettings}>
    {bannerImages.map(({ img, title, subtitle }, i) => (
      <Box
        key={i}
        sx={{
          height: { xs: 360, md: 540 },
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center', // horizontally center
          px: { xs: 3, md: 10 },
          color: '#fff',
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            bgcolor: 'rgba(0,0,0,0.5)',
            p: { xs: 3, md: 6 },
            borderRadius: 3,
            boxShadow: 4,
            textAlign: 'center',
             mt: { xs: 3, md: 5 },// controls vertical spacing from top
            mx:'auto'
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3.5rem' },
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.85)',
              mb: 4,
            }}
          >
            {subtitle}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'uppercase',
            }}
            component={Link}
            to="/login"
          >
            Try Snapalyze
          </Button>
        </Box>
      </Box>
    ))}
  </Slider>
</Box>



      {/* About Us */}
     {/* About Snapalyze */}
<Container id="about" sx={{ mb: 12, scrollMarginTop: '80px' }}>
  <Typography
    variant="h3"
    align="center"
    fontWeight="bold"
    sx={{ mb: 6 }}
  >
    About Us
  </Typography>

  <Box sx={{ maxWidth: 800, mx: 'auto' }}>
    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: 'text.secondary' }}>
      Snapalyze is a revolutionary AI-powered platform designed to transform how businesses and individuals extract information from images. Our cutting-edge technology combines advanced machine learning algorithms with intuitive user interfaces to deliver exceptional image analysis capabilities.
    </Typography>

    <Typography variant="h5" fontWeight="bold" sx={{ mt: 5, mb: 2 }}>
      Our Mission
    </Typography>
    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: 'text.secondary' }}>
      Our mission is to make advanced AI image analysis accessible to everyone. We believe that the power of computer vision should not be limited to tech giants or specialized industries. By providing user-friendly tools and powerful APIs, we're democratizing access to AI-powered image analysis.
    </Typography>

    <Typography variant="h5" fontWeight="bold" sx={{ mt: 5, mb: 2 }}>
      Our Team
    </Typography>
    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: 'text.secondary' }}>
      Founded by a team of AI researchers, software engineers, and business professionals, Snapalyze brings together diverse expertise to create a product that's both technically advanced and commercially viable. Our team members have backgrounds in computer vision, deep learning, user experience design, and enterprise software development.
    </Typography>

    <Typography variant="h5" fontWeight="bold" sx={{ mt: 5, mb: 2 }}>
      Our Technology
    </Typography>
    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
      At the core of Snapalyze is our proprietary deep learning engine that powers all our image analysis features. We've spent years training our models on diverse datasets to ensure they perform accurately across a wide range of image types and use cases. Our algorithms are continuously improving through active learning techniques that incorporate user feedback.
    </Typography>
  </Box>
  
</Container>



   <Container id="features" sx={{ mb: 12, scrollMarginTop: '80px' }}>
    <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
      Features
    </Typography>
    <Typography
      variant="body1"
      align="center"
      color="text.secondary"
      sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
    >
      Snapalyze offers a comprehensive suite of AI-driven image analysis tools that empower you to unlock the full potential of your visual data.
    </Typography>

    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4,
        mt: 4,
      }}
    >
      {features.map(({ title, description }, index) => (
        <Box
          key={index}
          sx={{
            width: 320,
            borderRadius: 4,
            boxShadow: 4,
            bgcolor: '#fff',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            transition: '0.3s',
            '&:hover': {
              boxShadow: 8,
              transform: 'translateY(-6px)',
            },
          }}
        >
          {/* Header with background color */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              p: 2,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <Typography variant="h6" fontWeight="bold" align="center" noWrap>
              {title}
            </Typography>
          </Box>

          {/* Content with padding */}
          <Box sx={{ p: 3, flexGrow: 1 }}>
            <ul
              style={{
                textAlign: 'left',
                paddingLeft: 20,
                margin: 0,
                color: 'rgba(0, 0, 0, 0.7)',
                fontSize: '1rem',
                lineHeight: 1.6,
                listStyleType: 'disc',
              }}
            >
              {description.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </Box>

          {/* Optional: Divider and a button-like footer */}
          <Divider sx={{ mx: 3 }} />
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="button" color="primary" sx={{ cursor: 'pointer' }}>
              Learn More
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
      
  </Container>



      {/* Pricing Section */}
      <Container id="pricing" sx={{ mb: 12, scrollMarginTop: '80px' }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Pricing
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
            mt: 4,
          }}
        >
          {pricingPlans.map((plan, index) => (
            <Box
              key={index}
              sx={{
                width: 300,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ bgcolor: plan.headerBg, p: 3, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {plan.title}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {plan.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {plan.period}
                </Typography>
              </Box>
              <Box sx={{ p: 3, flexGrow: 1 }}>
                <ul style={{ paddingLeft: 20, listStyle: 'disc' }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ marginBottom: '0.75rem' }}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Box>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Button
                  component={Link}
                  to={plan.link}
                  variant="contained"
                  fullWidth
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  {plan.buttonText}
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
        
      </Container>

      <Footer />
    </Box>
  );
}
