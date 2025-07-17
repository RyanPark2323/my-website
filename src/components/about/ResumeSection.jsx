import React from 'react';

const ResumeSection = () => {
  return (
    <section className="text-center p-8 bg-white rounded-lg mb-8 shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Resume</h2>
      <p className="text-lg text-gray-600 mb-4">Click below to view my resume:</p>
      <a 
        href="/assets/Resume - Base (WEB).docx.pdf" 
        target="_blank" 
        className="inline-block px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
      >
        View Resume
      </a>
    </section>
  );
};

export default ResumeSection;