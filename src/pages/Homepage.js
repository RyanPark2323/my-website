import React from 'react';

const HomePage = ({ navigateTo }) => {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-6xl font-bold mb-2">Ryan Park</h1>
        <p className="text-2xl opacity-80">Computer Science Major | Specializing in AI, Cybersecurity, and Web Development</p>
      </section>

      {/* Featured Project Section */}
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

      {/* About Section */}
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

      {/* Contact Section */}
      <section className="text-center p-8 bg-gray-50 max-w-4xl mx-auto my-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-green-500 mb-4">Contact Me</h2>
        <p className="text-xl">Email: ryan.park2322@gmail.com | Phone: (385) 347-1636</p>
      </section>

      {/* Footer */}
      <footer className="text-center p-4 bg-gray-100">
        <p>&copy; 2025 Ryan Park</p>
      </footer>
    </main>
  );
};

export default HomePage;