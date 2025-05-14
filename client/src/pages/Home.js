import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';  // Fixed the Footer import
import Section from '../components/Section'; // Assuming you have a Section component

function Home() {
  return (
    <Box>
      <Header />
      <Box component="main" sx={{ p: 4 }}>
        {/* Blank Hero Section */}
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: 6 }}>
          <Box sx={{ flex: 1 }}></Box>
          <Box sx={{ flex: 1 }}></Box>
        </Container>

        {/* Sections with Titles */}
        <Section
          title="About Us"
          content=""
        />
        <Section
          title="Our Products"
          content=""
        />
        <Section
          title="Pricing"
          content=""
        />
      </Box>
      <Footer />
    </Box>
  );
}

export default Home;
