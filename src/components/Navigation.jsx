import React from 'react';
import { Linkedin } from 'lucide-react';

const Navigation = ({ isMenuOpen, toggleMenu, navigateTo }) => {
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 p-4">
        <div 
          className="fixed top-5 left-5 w-8 h-6 cursor-pointer z-[1001] flex flex-col justify-between"
          onClick={toggleMenu}
        >
          <div className="h-[3px] bg-gray-800 rounded-full transition-all duration-300"></div>
          <div className="h-[3px] bg-gray-800 rounded-full transition-all duration-300"></div>
          <div className="h-[3px] bg-gray-800 rounded-full transition-all duration-300"></div>
        </div>
      </header>

      <nav className={`fixed top-0 left-0 w-full h-screen bg-black/95 flex flex-col justify-center items-center z-[999] transition-all duration-500 ${
        isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <ul className="list-none text-center mb-8">
          <li className="my-6">
            <a 
              href="#" 
              className="text-white text-2xl font-bold hover:text-green-500 transition-colors"
              onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
            >
              Home
            </a>
          </li>
          <li className="my-6">
            <a 
              href="#" 
              className="text-white text-2xl font-bold hover:text-green-500 transition-colors"
              onClick={(e) => { e.preventDefault(); navigateTo('about'); }}
            >
              About
            </a>
          </li>
          <li className="my-6">
            <a 
              href="#" 
              className="text-white text-2xl font-bold hover:text-green-500 transition-colors"
              onClick={(e) => { e.preventDefault(); navigateTo('projects'); }}
            >
              Projects
            </a>
          </li>
        </ul>
        
        <div className="text-white text-center p-4 mt-8">
          <p className="my-3">Email: ryan.park2322@gmail.com</p>
          <p className="my-3">Phone: (385) 347-1636</p>
          <p className="my-3">
            <Linkedin className="inline w-5 h-5 mr-2" />
            <a href="https://www.linkedin.com/in/ryan-park23" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-500 transition-colors">
              LinkedIn
            </a>
          </p>
        </div>
      </nav>
    </>
  );
};

export default Navigation;