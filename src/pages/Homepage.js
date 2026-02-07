import React from 'react';
import { timelineData } from '../data/timelineData';
import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';

const SectionHeader = ({ number, title }) => (
  <div className="flex items-center gap-4 mb-12">
    <span className="font-mono text-gold text-lg">{number}</span>
    <h2 className="text-3xl font-serif font-semibold text-slate-100 tracking-tight">{title}</h2>
    <div className="h-px bg-slate-800 flex-grow max-w-xs ml-4"></div>
  </div>
);

function Homepage() {
  return (
    <div className="min-h-screen bg-onyx text-slate-300 font-sans selection:bg-gold selection:text-onyx">

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-onyx/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif font-bold text-xl tracking-tighter text-white hover:text-gold transition-colors">RP.</Link>
          <div className="flex gap-8 text-sm font-medium text-slate-400 items-center">
            <a href="#experience" className="hover:text-gold transition-colors hidden sm:block">Experience</a>
            <Link to="/projects" className="hover:text-gold transition-colors">Projects</Link>
            <a href="mailto:ryan.park2322@gmail.com" className="hover:text-gold transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-32 md:pt-48">

      {/* Hero */}
      <header className="mb-32 text-center md:text-left">
        <h1 className="text-6xl md:text-9xl font-serif font-bold text-slate-100 tracking-tight mb-6">
          Ryan Park.
        </h1>
        <h2 className="text-xl md:text-2xl font-light text-slate-400 tracking-wide mb-12 max-w-2xl leading-relaxed">
          Engineering Intelligent Solutions at the <span className="text-gold">University of Utah</span>.
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
            <Link to="/projects" className="inline-block px-8 py-4 bg-slate-100 text-onyx font-medium rounded hover:bg-gold hover:text-onyx transition-colors text-center">
            View My Work
            </Link>
            <a href="/assets/Ryan_Park_Resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 border border-slate-700 text-slate-300 font-medium rounded hover:border-gold hover:text-gold transition-colors text-center">
            Resume
            </a>
        </div>
      </header>


        {/* Experience */}
        <section id="experience" className="py-24">
          <SectionHeader number="01." title="Professional Experience" />
          <div className="border-l-2 border-slate-800 ml-3 md:ml-6 space-y-12 pl-8 md:pl-12 relative">
            {timelineData.map((job, index) => (
              <div key={index} className="relative group">
                <div className="absolute -left-[41px] md:-left-[59px] top-1 h-5 w-5 rounded-full border-2 border-gold bg-onyx group-hover:bg-gold transition-colors"></div>
                <h3 className="text-2xl font-serif font-bold text-slate-100">
                  {job.title} <span className="text-gold">@ {job.subtitle}</span>
                </h3>
                <p className="font-mono text-sm text-slate-500 mb-4 mt-1">{job.date}</p>
                <p className="text-slate-400 max-w-2xl leading-relaxed mb-4">
                  {job.description}
                </p>
                {job.tags && (
                  <div className="flex flex-wrap gap-3">
                    {job.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono text-amber-200 bg-gold/10 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 text-center border-t border-white/5 mt-12 flex flex-col items-center">
          <h2 className="text-4xl font-serif font-bold text-slate-100 mb-6">Let's Connect</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-10">
            I am currently looking for new opportunities in Software Engineering and AI for Spring 2026.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20">
             <a href="mailto:ryan.park2322@gmail.com" className="inline-block px-8 py-4 border border-gold text-gold font-medium rounded hover:bg-gold/10 transition-colors">
                Say Hello
            </a>
             <a href="https://www.linkedin.com/in/ryan-park23" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-gold transition-colors p-4">
                <Linkedin className="w-8 h-8" />
                <span className="sr-only">LinkedIn</span>
            </a>
          </div>

          <p className="font-mono text-xs text-slate-600">
            Designed & Built by Ryan Park
          </p>
        </footer>

      </main>
    </div>
  );
}

export default Homepage;
