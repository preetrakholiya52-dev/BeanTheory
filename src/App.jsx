import React, { useState, useEffect, useRef } from 'react';
import ReactLenis, { useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar';
import CinematicIntro from './components/Hero/CinematicIntro';
import CoffeeScene from './components3D/CoffeeScene/CoffeeScene';
import CustomCursor from './components/ui/CustomCursor';
import { useReducedMotion } from './hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

function LenisScrollTriggerBridge() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIntroFinished(true);
    }
  }, [prefersReducedMotion]);

  // Synchronize GSAP ticker with Lenis rAF loop
  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // Recalculate ScrollTrigger measurements once cinematic intro finishes
  useEffect(() => {
    if (introFinished) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [introFinished]);

  return (
    <ReactLenis ref={lenisRef} autoRaf={false} root options={{ lerp: 0.05, syncTouch: true }}>
      <LenisScrollTriggerBridge />
      <CustomCursor />
      <div className="relative w-full bg-bean-bg min-h-screen text-bean-white selection:bg-bean-accent selection:text-bean-bg">
        {!introFinished && <CinematicIntro onComplete={() => setIntroFinished(true)} />}
        
        {/* Fixed 3D Canvas Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <CoffeeScene introFinished={introFinished} />
        </div>
        
        {/* HTML Scrolling Layer */}
        <div className="relative z-10 w-full flex flex-col">
          <Navbar />
          <Home introFinished={introFinished} />
        </div>
      </div>
    </ReactLenis>
  );
}

export default App;
