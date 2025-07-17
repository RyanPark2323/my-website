import React from 'react';
import Timeline from '../components/Timeline';

const AboutPage = () => {
  return (
    <main className="pt-20 pb-8 px-4 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* About Blurb */}
      <section className="text-center p-10 bg-white rounded-lg mb-12 shadow-lg">
        <h2 className="text-4xl font-bold mb-6 text-gray-800 relative inline-block">
          About Me
          <span className="absolute w-16 h-1 bg-green-500 -bottom-2 left-1/2 transform -translate-x-1/2"></span>
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed mt-8">
          I am a Computer Science major with a strong passion for web development, cybersecurity, and artificial intelligence.
          I'm especially interested by the intersection of AI innovation and cybersecurity, and have spent my education developing skills related to both fields.
          As someone who believes in continual and ongoing learning, I enjoy spending my free time doing CTF challenges through sites like PicoCTF and HackThebox.
          I'm a passionate and collaborative team player who thrives in dynamic environments where curiosity and creativity are the focus.
          Outside of tech, I'm currently reading through the Dune series after enjoying the films.
        </p>
      </section>

      {/* Timeline Component */}
      <Timeline />

      {/* Resume Section */}
      <section className="text-center p-8 bg-white rounded-lg mb-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Resume</h2>
        <p className="text-lg text-gray-600 mb-4">Click below to view my resume:</p>
        <a 
          href="/assets/Resume - Base (WEB).docx.pdf" 
          target="_blank" 
          className="inline-block px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
        >
          View Resume
        </a>
      </section>

      {/* LinkedIn Section */}
      <section className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">LinkedIn</h2>
        <p className="text-lg text-gray-600 mb-4">Click below to view my LinkedIn profile:</p>
        <a 
          href="https://www.linkedin.com/in/ryan-park23" 
          target="_blank" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          View LinkedIn Profile
        </a>
      </section>
    </main>
  );
};

export default AboutPage;