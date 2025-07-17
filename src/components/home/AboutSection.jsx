import React from 'react';

const AboutSection = ({ navigateTo }) => {
  return (
    <section className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="flex max-w-6xl mx-auto items-center gap-16 flex-col lg:flex-row">
        <div className="flex-1">
          <h2 className="text-green-500 text-4xl font-bold mb-6">About Me</h2>
          <p className="mb-4 leading-relaxed">
            I'm a Computer Science student at the University of Utah, specializing in Artificial Intelligence. My academic journey has inspired a deep interest in cybersecurity, web development, and AI, and I am excited when exploring how these fields intersect to solve real-world problems.
          </p>
          <p className="mb-6 leading-relaxed">
            When I'm not at school or work, you can find me tackling CTF challenges, in the gym, or reading a good book.
          </p>
          <button 
            onClick={() => navigateTo('about')}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition-colors"
          >
            Learn More
          </button>
        </div>
        <div className="flex-1">
          <img src="/assets/img11.jpg" alt="Ryan Park" className="w-full rounded-full shadow-lg" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;