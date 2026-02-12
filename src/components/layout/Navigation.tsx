import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Github, Linkedin, Mail } from 'lucide-react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-elevated/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Name */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-2xl font-bold text-gradient hover:opacity-80 transition-opacity"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          RP
        </motion.button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('projects')}
            className="text-text-secondary hover:text-accent-primary transition-colors font-medium"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection('skills')}
            className="text-text-secondary hover:text-accent-primary transition-colors font-medium"
          >
            Skills
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-text-secondary hover:text-accent-primary transition-colors font-medium"
          >
            About
          </button>
          
          {/* Social Icons */}
          <div className="flex items-center gap-3 ml-4">
            <a
              href="https://github.com/ryanpark2323"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-primary transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/ryanpark2323"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-primary transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:ryan.park2322@gmail.com"
              className="text-text-secondary hover:text-accent-primary transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>

          {/* Resume Download Button */}
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/80 transition-all hover:scale-105"
          >
            <Download size={16} />
            Resume
          </a>
        </div>

        {/* Mobile Menu Button - Add later if needed */}
        <div className="md:hidden">
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg text-sm"
          >
            <Download size={14} />
            Resume
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
