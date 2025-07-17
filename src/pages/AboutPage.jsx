import React from 'react';
import AboutBlurb from '../components/about/AboutBlurb';
import Timeline from '../components/about/Timeline';
import ResumeSection from '../components/about/ResumeSection';
import LinkedInSection from '../components/about/LinkedInSection';

const AboutPage = () => {
  return (
    <main className="pt-20 pb-8 px-4 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <AboutBlurb />
      <Timeline />
      <ResumeSection />
      <LinkedInSection />
    </main>
  );
};

export default AboutPage;