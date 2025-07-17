import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjecModal'
import { projectsData } from '../data/projectsData';

const ProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <main className="pt-20 pb-8 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-8 bg-gray-50 mb-8">
        <h1 className="text-5xl font-bold mb-4 text-gray-800 relative inline-block">
          My Projects
          <span className="absolute w-16 h-1 bg-green-500 -bottom-2 left-1/2 transform -translate-x-1/2"></span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8">
          A showcase of my work in software development, cybersecurity, and web applications
        </p>
      </section>

      {/* Projects Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => setSelectedProject(project)} 
            />
          ))}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </main>
  );
};

export default ProjectsPage;