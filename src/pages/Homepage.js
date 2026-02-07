import React, { useState } from 'react';
import { timelineData } from '../data/timelineData';
import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';

const SectionHeader = ({ number, title }) => (
  <div className="flex items-center gap-4 mb-12 fade-in-up">
    <span className="font-mono text-gold text-lg">{number}</span>
    <h2 className="text-3xl font-serif font-semibold text-slate-100 tracking-tight">{title}</h2>
    <div className="h-px bg-slate-800 flex-grow max-w-xs ml-4"></div>
  </div>
);

function Homepage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:ryan.park2322@gmail.com?subject=Contact from ${formData.name}&body=${formData.message}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-gold selection:text-onyx overflow-x-hidden relative">

      {/* Background with breathing animation */}
      <div className="fixed inset-0 pointer-events-none z-0 breathing-bg bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif font-bold text-xl tracking-tighter text-white hover:text-gold transition-colors">RP.</Link>
          <div className="flex gap-8 text-sm font-medium text-slate-400 items-center">
            <a href="#experience" className="hover:text-gold transition-colors hidden sm:block">Experience</a>
            <Link to="/projects" className="hover:text-gold transition-colors">Projects</Link>
            <a href="mailto:ryan.park2322@gmail.com" className="hover:text-gold transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 md:pt-48">

      {/* Hero */}
      <header className="mb-32 text-center md:text-left fade-in-up">
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
        <section id="experience" className="py-24 fade-in-up delay-200">
          <SectionHeader number="01." title="Professional Experience" />
          <div className="space-y-8">
            {timelineData.map((job, index) => (
              <div key={index} className="group grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-8 p-6 rounded-lg transition-colors hover:bg-white/5">
                <div className="md:text-right">
                  <p className="font-mono text-xs text-slate-500 pt-2 group-hover:text-gold/70 transition-colors">{job.date}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-slate-100 mb-1 group-hover:text-gold transition-colors">
                    {job.role}
                  </h3>
                  <p className="text-sm font-sans uppercase tracking-wider text-gold mb-3">
                    {job.company}
                  </p>
                  <p className="text-slate-400 leading-relaxed mb-4">
                    {job.description}
                  </p>
                  {job.tags && (
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded group-hover:border-slate-700 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 border-t border-white/5 mt-12 fade-in-up delay-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">

            {/* Left Column */}
            <div className="flex flex-col justify-start">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6">Let's Connect.</h2>
              <p className="text-slate-400 max-w-md leading-relaxed mb-8">
                I am currently looking for new opportunities in Software Engineering and AI for Spring 2026.
              </p>
              <a href="https://www.linkedin.com/in/ryan-park23" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors font-medium w-fit">
                <Linkedin className="w-5 h-5" />
                <span>Connect on LinkedIn</span>
              </a>
            </div>

            {/* Right Column (Form) */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group">
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-slate-300 placeholder-slate-600 focus:border-gold outline-none transition-all duration-300"
                  required
                />
              </div>
              <div className="group">
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-slate-300 placeholder-slate-600 focus:border-gold outline-none transition-all duration-300"
                  required
                />
              </div>
              <div className="group">
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-slate-300 placeholder-slate-600 focus:border-gold outline-none transition-all duration-300 resize-none"
                  required
                ></textarea>
              </div>

              <button type="submit" className="inline-block px-8 py-4 bg-slate-100 text-onyx font-medium rounded hover:bg-gold hover:text-onyx transition-colors">
                Send Message
              </button>
            </form>
          </div>

          <div className="mt-24 pt-8 border-t border-slate-800 text-center md:text-left">
            <p className="font-mono text-xs text-slate-600">
              Designed & Built by Ryan Park
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
}

export default Homepage;
