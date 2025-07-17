import React from 'react';
import { X, ExternalLink } from 'lucide-react';

const ProjectModal = ({ project, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 z-[1010] overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative bg-white m-8 md:m-20 p-0 max-w-4xl mx-auto rounded-lg shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-5 text-3xl font-bold text-gray-600 hover:text-black cursor-pointer z-10"
          onClick={onClose}
        >
          <X />
        </button>
        
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">{project.title}</h2>
            <p className="text-gray-600 text-lg mb-4">{project.brief}</p>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-8">{project.description}</p>
          
          {project.images.length > 0 && (
            <div className={`flex flex-wrap gap-4 mb-8 justify-center ${project.images.length === 1 ? 'single-image' : ''}`}>
              {project.images.map((img, index) => (
                <div key={index} className={`rounded-lg overflow-hidden ${project.images.length === 1 ? 'w-4/5 h-80' : 'h-64 max-w-sm'} flex items-center justify-center bg-gray-50`}>
                  <img src={img} alt={project.title} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          )}
          
          <div className="mb-8">
            <h4 className="text-xl font-bold mb-3 text-gray-800">Technologies Used</h4>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4 flex-wrap">
            {project.repoLink && (
              <a 
                href={project.repoLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all hover:-translate-y-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {project.repoLinkText || "View Repository"}
              </a>
            )}
            
            {project.demoLink && (
              <a 
                href={project.demoLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all hover:-translate-y-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {project.demoLinkText || "Live Demo"}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;