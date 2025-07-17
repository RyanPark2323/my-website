import React from 'react';

const AboutBlurb = () => {
  return (
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
  );
};

export default AboutBlurb;