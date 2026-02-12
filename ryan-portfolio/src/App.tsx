import Navigation from './components/layout/Navigation';
import ScrollIndicator from './components/layout/ScrollIndicator';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import About from './components/sections/About';

function App() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Navigation />
      <ScrollIndicator />
      
      <main>
        <Hero />
        <Projects />
        <Skills />
        <About />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
