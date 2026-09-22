import React, { useState, useEffect } from 'react';
import ReactLenis from 'lenis/react';
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar';
import CinematicIntro from './components/Hero/CinematicIntro';
import CoffeeScene from './components3D/CoffeeScene/CoffeeScene';
import CustomCursor from './components/ui/CustomCursor';
import { useReducedMotion } from './hooks/useReducedMotion';

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIntroFinished(true);
    }
  }, [prefersReducedMotion]);

  return (
    <ReactLenis root options={{ lerp: 0.05, syncTouch: true }}>
      <CustomCursor />
      <div className="relative w-full bg-bean-bg min-h-screen text-bean-white overflow-hidden selection:bg-bean-accent selection:text-bean-bg">
        {!introFinished && <CinematicIntro onComplete={() => setIntroFinished(true)} />}
        
        {/* Fixed 3D Canvas Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <CoffeeScene introFinished={introFinished} />
        </div>
        
        {/* HTML Scrolling Layer */}
        <div className="relative z-10 w-full flex flex-col items-center">
          <Navbar />
          <Home introFinished={introFinished} />
        </div>
      </div>
    </ReactLenis>
  );
}

export default App;
