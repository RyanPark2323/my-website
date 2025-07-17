import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProject from '../components/home/FeaturedProject';
import AboutSection from '../components/home/AboutSection';
import ContactSection from '../components/home/ContactSection';
import Footer from '../components/common/Footer';

const HomePage = ({ navigateTo }) => {
  return (
    <main className="bg-white">
      <HeroSection />
      <FeaturedProject navigateTo={navigateTo} />
      <AboutSection navigateTo={navigateTo} />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default HomePage;