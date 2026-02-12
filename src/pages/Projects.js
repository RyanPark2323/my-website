import React from 'react';
import { projectsData } from '../data/projectsdata';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';

const Projects = () => {
  return (
    <div className="min-h-screen bg-onyx text-slate-300 font-sans selection:bg-gold selection:text-onyx p-6 md:p-12">
      {/* Navigation */}
      <nav className="mb-16 max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center text-gold hover:text-amber-200 transition-colors font-medium group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </nav>

      <header className="max-w-6xl mx-auto mb-16 fade-in-up">
        <h1 className="text-5xl md:text-7xl font-serif text-slate-100 mb-6">Selected Works</h1>
        <p className="text-xl text-slate-400 max-w-2xl font-light">
            A collection of technical projects exploring system architecture, cloud infrastructure, and automation.
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 fade-in-up delay-200">
        {projectsData.map((project, index) => (
          <SpotlightCard key={index} className="group p-8 flex flex-col h-full">
            <h2 className="text-3xl font-serif text-slate-100 mb-3 group-hover:text-gold transition-colors">
              {project.title}
            </h2>
            <p className="font-mono text-xs text-gold mb-6 uppercase tracking-wider">
              {project.category}
            </p>
            <p className="text-slate-300 leading-relaxed mb-8 flex-grow">
              {project.description}
            </p>
            {project.link && project.link !== "#" && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-auto inline-block text-sm font-medium text-slate-400 hover:text-white transition-colors border-b border-slate-700 hover:border-white pb-0.5 w-max">
                    View Project
                </a>
            )}
          </SpotlightCard>
        ))}
      </main>
    </div>
  );
};

export default Projects;
