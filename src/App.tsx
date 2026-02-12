import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import About from './components/sections/About';

function App() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Navigation />

      <main>
        <Hero />
        <Projects />
        <About />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
