import React, { useState } from 'react';
import ProjectsHero from '../components/projects/ProjectsHero';
import ProjectGrid from '../components/projects/ProjectGrid';
import ProjectModal from '../components/projects/ProjectModal';
import { projectsData } from '../data/projectsData';

const ProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <main className="pt-20 pb-8 bg-gray-50 min-h-screen">
      <ProjectsHero />
      <ProjectGrid 
        projects={projectsData} 
        onProjectClick={setSelectedProject} 
      />
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