import React from 'react';

const LinkedInSection = () => {
  return (
    <section className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">LinkedIn</h2>
      <p className="text-lg text-gray-600 mb-4">Click below to view my LinkedIn profile:</p>
      <a 
        href="https://www.linkedin.com/in/ryan-park23" 
        target="_blank" 
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
      >
        View LinkedIn Profile
      </a>
    </section>
  );
};

export default LinkedInSection;