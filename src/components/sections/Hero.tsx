import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import GeometricConstellation from '../../three/GeometricConstellation';

export default function Hero() {
  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <GeometricConstellation />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-base/50 to-bg-base z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Name */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="text-gradient">Ryan Park</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Computer Science student specializing in AI, designing secure IT infrastructure, cloud systems, and intelligent solutions
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <button
              onClick={scrollToProjects}
              className="px-8 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/80 transition-all hover:scale-105 font-medium"
            >
              View Projects
            </button>
            <a
              href="mailto:ryan.park2322@gmail.com"
              className="px-8 py-3 border-2 border-accent-primary text-accent-primary rounded-lg hover:bg-accent-primary/10 transition-all hover:scale-105 font-medium"
            >
              Get in Touch
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <a
              href="https://github.com/ryanpark2323"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-primary transition-colors hover:scale-110"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/ryanpark2323"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-primary transition-colors hover:scale-110"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:ryan.park2322@gmail.com"
              className="text-text-secondary hover:text-accent-primary transition-colors hover:scale-110"
            >
              <Mail size={24} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
