import React from 'react';
import { timelineData } from '../data/timelineData';
import { projectsData } from '../data/projectsdata';

const SectionHeader = ({ number, title }) => (
  <div className="flex items-center gap-4 mb-12">
    <span className="font-mono text-cyan-400 text-lg">{number}</span>
    <h2 className="text-3xl font-semibold text-slate-100 tracking-tight">{title}</h2>
    <div className="h-px bg-slate-800 flex-grow max-w-xs ml-4"></div>
  </div>
);

function Homepage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-900 selection:text-white">

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter text-white">RP.</div>
          <div className="flex gap-8 text-sm font-medium text-slate-400">
            <a href="#experience" className="hover:text-cyan-400 transition-colors">Experience</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <a href="mailto:ryan.park2322@gmail.com" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-40 pb-32">
        <p className="font-mono text-cyan-400 mb-6 tracking-wide">Hi, my name is</p>
        <h1 className="text-6xl md:text-8xl font-bold text-slate-100 tracking-tight mb-4">
          Ryan Park.
        </h1>
        <h2 className="text-4xl md:text-6xl font-semibold text-slate-500 tracking-tight mb-8">
          I build intelligent infrastructure.
        </h2>
        <p className="max-w-xl text-lg text-slate-400 leading-relaxed mb-12">
          I'm a Computer Science undergraduate at the <span className="text-cyan-400">University of Utah</span> specializing in AI and cloud systems.
          Currently, I'm streamlining research operations as an IT Support Intern at ORIS.
        </p>
        <a href="#projects" className="inline-block px-8 py-4 border border-cyan-400 text-cyan-400 font-mono rounded hover:bg-cyan-400/10 transition-colors">
          Check out my work
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-6">

        {/* Experience */}
        <section id="experience" className="py-24">
          <SectionHeader number="01." title="Where I've Worked" />
          <div className="border-l-2 border-slate-800 ml-3 md:ml-6 space-y-12 pl-8 md:pl-12 relative">
            {timelineData.map((job, index) => (
              <div key={index} className="relative group">
                <div className="absolute -left-[41px] md:-left-[59px] top-1 h-5 w-5 rounded-full border-2 border-cyan-400 bg-slate-950 group-hover:bg-cyan-400 transition-colors"></div>
                <h3 className="text-2xl font-bold text-slate-100">
                  {job.title} <span className="text-cyan-400">@ {job.subtitle}</span>
                </h3>
                <p className="font-mono text-sm text-slate-500 mb-4 mt-1">{job.date}</p>
                <p className="text-slate-400 max-w-2xl leading-relaxed mb-4">
                  {job.description}
                </p>
                {job.tags && (
                  <div className="flex flex-wrap gap-3">
                    {job.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono text-cyan-300 bg-cyan-400/10 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="py-24">
          <SectionHeader number="02." title="Software Creations" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project, index) => (
              <div key={index} className="bg-slate-900/50 p-8 rounded-lg hover:-translate-y-2 transition-transform duration-300 border border-transparent hover:border-cyan-400/30 group">
                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {project.description}
                </p>
                <p className="text-xs font-mono text-slate-500 mt-auto">
                  {project.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 text-center">
          <h2 className="text-4xl font-bold text-slate-100 mb-6">What's Next?</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-10">
            I am currently looking for new opportunities in Software Engineering and AI for Spring 2026.
          </p>
          <a href="mailto:ryan.park2322@gmail.com" className="inline-block px-8 py-4 border border-cyan-400 text-cyan-400 font-mono rounded hover:bg-cyan-400/10 transition-colors">
            Say Hello
          </a>
          <p className="mt-20 font-mono text-xs text-slate-600">
            Designed & Built by Ryan Park
          </p>
        </footer>

      </main>
    </div>
  );
}

export default Homepage;