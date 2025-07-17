import React from 'react';

const ProjectGrid = ({ projects, onProjectClick }) => {
  const getProjectImage = (project) => {
    const imageMap = {
      1: "/assets/img6.jpg",
      2: "/assets/img5.webp",
      3: "/assets/img7.png",
      4: "/assets/img4.png",
      5: "/assets/img1.png",
      6: "/assets/img8.png",
      7: "/assets/img9.png"
    };
    return imageMap[project.id] || "/assets/placeholder.png";
  };

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            onClick={() => onProjectClick(project)}
          >
            <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-50">
              <img 
                src={getProjectImage(project)} 
                alt={project.title}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{project.brief}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {project.techStack.slice(0, 3).map((tech, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectGrid;