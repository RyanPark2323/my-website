import React from 'react';

const FeaturedProject = ({ navigateTo }) => {
  return (
    <section className="min-h-screen flex items-center justify-center p-8">
      <div className="flex max-w-6xl mx-auto items-center gap-16 flex-col lg:flex-row">
        <div className="flex-1">
          <img src="/assets/img1.png" alt="Featured Project" className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="flex-1">
          <h2 className="text-green-500 text-xl mb-2">Featured Project</h2>
          <h3 className="text-4xl font-bold mb-4">Sprite Editor</h3>
          <p className="mb-6 leading-relaxed">
            For this project, I worked with a team to develop a custom sprite editor inspired by Piskel, implementing real-time pixel editing, color selection, frame management, and animation preview using C++ and Qt Creator. Throughout development, I strengthened my skills in event-driven programming, UI/UX design, and object-oriented architecture. We followed agile methodologies, incorporating iterative development cycles, weekly sprint goals, and regular Scrum meetings to ensure consistent progress and team alignment.
          </p>
          <div className="flex gap-4 mb-6 flex-wrap">
            <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">C++</span>
            <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">Qt Creator</span>
            <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">Agile Methodologies</span>
          </div>
          <button 
            onClick={() => navigateTo('projects')}
            className="border-2 border-green-500 text-green-500 px-6 py-3 rounded hover:bg-green-50 transition-colors"
          >
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;