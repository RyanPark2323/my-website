import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const navigateTo = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <div className="App">
      <Navigation isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} navigateTo={navigateTo} />
      
      {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'projects' && <ProjectsPage />}
    </div>
  );
}

export default App;