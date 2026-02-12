import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      className="group relative bg-bg-elevated border border-border rounded-xl overflow-hidden card-hover"
    >
      {/* Project Image */}
      <div className="relative h-64 bg-gradient-to-br from-accent-primary/20 to-accent-tertiary/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-text-primary mb-2">{project.title}</h3>
            <p className="text-text-secondary text-sm">Project Screenshot Coming Soon</p>
          </div>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-bg-base/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-accent-primary rounded-full hover:scale-110 transition-transform"
            >
              <Github size={20} />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-accent-secondary rounded-full hover:scale-110 transition-transform"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Project Details */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-text-primary mb-2">{project.title}</h3>
        <p className="text-text-secondary mb-4">{project.description}</p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-mono bg-accent-primary/10 text-accent-primary border border-accent-primary/20 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Highlights */}
        <ul className="space-y-2">
          {project.highlights.slice(0, 2).map((highlight, idx) => (
            <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
              <span className="text-accent-primary mt-1">▸</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
