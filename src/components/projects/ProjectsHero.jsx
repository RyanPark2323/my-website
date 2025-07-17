import React from 'react';

const ProjectsHero = () => {
  return (
    <section className="text-center py-20 px-8 bg-gray-50 mb-8">
      <h1 className="text-5xl font-bold mb-4 text-gray-800 relative inline-block">
        My Projects
        <span className="absolute w-16 h-1 bg-green-500 -bottom-2 left-1/2 transform -translate-x-1/2"></span>
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8">
        A showcase of my work in software development, cybersecurity, and web applications
      </p>
    </section>
  );
};

export default ProjectsHero;