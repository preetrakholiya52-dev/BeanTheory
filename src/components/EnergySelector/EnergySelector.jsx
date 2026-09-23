import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Magnetic from '../ui/Magnetic';

gsap.registerPlugin(ScrollTrigger);

const ENERGY_STATES = {
  FOCUS: {
    bg: '#090909',
    textColor: '#FFF8EC',
    accentColor: '#1B100B',
    typography: 'font-display uppercase tracking-widest',
    product: 'Espresso',
    description: 'Zero distractions. Pure clarity.',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80',
    motionConfig: { scale: 1, rotation: 0, y: 0, duration: 1 } // Still
  },
  ENERGY: {
    bg: '#D95F02', 
    textColor: '#090909',
    accentColor: '#FFF8EC', 
    typography: 'font-sans font-bold uppercase tracking-tight italic',
    product: 'Cold Brew',
    description: 'High velocity. Unstoppable momentum.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
    motionConfig: { y: -15, scale: 1.05, rotation: 1, duration: 0.2, yoyo: true, repeat: -1, ease: 'power1.inOut' } // Energetic
  },
  CREATIVE: {
    bg: '#1B100B', 
    textColor: '#F3E7D0', 
    accentColor: '#D95F02', 
    typography: 'font-serif italic lowercase tracking-[0.2em]',
    product: 'Latte',
    description: 'Ideas flowing. Rules broken.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    motionConfig: { rotation: 8, x: 20, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' } // Experimental tilt
  },
  SLOW: {
    bg: '#F3E7D0', 
    textColor: '#1B100B', 
    accentColor: '#5A321F', 
    typography: 'font-serif font-light lowercase tracking-[0.3em]',
    product: 'Cappuccino',
    description: 'Take a breath. Savor the moment.',
    image: 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=800&q=80',
    motionConfig: { scale: 1.08, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' } // Soft breathing
  }
};

const modes = ['FOCUS', 'ENERGY', 'CREATIVE', 'SLOW'];

export default function EnergySelector() {
  const [activeMode, setActiveMode] = useState('FOCUS');
  
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const dynamicContentRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const motionTweenRef = useRef(null);
  
  const prefersReducedMotion = useReducedMotion();

  // Initialization: Set starting CSS via GSAP so it matches the state
  useEffect(() => {
    gsap.set(sectionRef.current, { backgroundColor: ENERGY_STATES['FOCUS'].bg });
    gsap.set(titleRef.current, { color: ENERGY_STATES['FOCUS'].textColor });
  }, []);

  // Handle continuous motion updates based on active mode
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    // Kill previous motion tween
    if (motionTweenRef.current) {
      motionTweenRef.current.kill();
    }
    
    const config = ENERGY_STATES[activeMode].motionConfig;
    
    if (activeMode === 'FOCUS') {
      motionTweenRef.current = gsap.to(imageWrapperRef.current, { 
        scale: 1, rotation: 0, y: 0, x: 0, duration: 1, ease: 'power3.out' 
      });
    } else {
      motionTweenRef.current = gsap.to(imageWrapperRef.current, config);
    }
    
    return () => {
      if (motionTweenRef.current) motionTweenRef.current.kill();
    };
  }, [activeMode, prefersReducedMotion]);

  const handleModeChange = (mode) => {
    if (mode === activeMode) return;
    
    const next = ENERGY_STATES[mode];
    
    // Smooth transition of global colors
    gsap.to(sectionRef.current, { backgroundColor: next.bg, duration: 0.8, ease: 'power3.inOut' });
    gsap.to(titleRef.current, { color: next.textColor, duration: 0.8, ease: 'power3.inOut' });
    
    // Crossfade dynamic content (Image & Text)
    const tl = gsap.timeline();
    tl.to(dynamicContentRef.current, { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      duration: 0.3, 
      ease: 'power2.in',
      onComplete: () => setActiveMode(mode) 
    })
    .to(dynamicContentRef.current, { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      duration: 0.5, 
      ease: 'back.out(1.5)' 
    });
  };

  const currentState = ENERGY_STATES[activeMode];

  return (
    <section 
      ref={sectionRef} 
      id="energy-selector"
      className="relative z-10 w-full min-h-[100svh] bg-[#090909] flex flex-col md:flex-row items-center justify-between px-6 md:px-24 py-24 pointer-events-auto"
    >
      
      {/* Selector Panel (Left) */}
      <div className="w-full md:w-1/3 flex flex-col gap-12 z-10 mb-16 md:mb-0">
        <h2 
          ref={titleRef} 
          className="text-4xl md:text-6xl font-display uppercase leading-tight tracking-widest"
        >
          What kind of<br/>day are you<br/>having?
        </h2>
        <div className="flex flex-col gap-4">
          {modes.map(mode => (
            <Magnetic key={mode}>
              <button 
                onClick={() => handleModeChange(mode)}
              className={`text-left text-3xl md:text-5xl font-sans font-bold tracking-widest transition-all duration-500 ease-out flex items-center gap-4 ${activeMode === mode ? 'opacity-100 translate-x-6' : 'opacity-30 hover:opacity-60'}`}
              style={{ color: currentState.textColor }} 
            >
              <span className={`h-[2px] w-8 bg-current transition-all duration-500 ${activeMode === mode ? 'opacity-100' : 'opacity-0 w-0'}`}></span>
              {mode}
              </button>
            </Magnetic>
          ))}
        </div>
      </div>

      {/* Dynamic Visual Environment (Right) */}
      <div 
        ref={dynamicContentRef} 
        className="w-full md:w-1/2 flex flex-col items-center md:items-end z-10"
      >
        <div className="relative w-full max-w-sm md:max-w-md aspect-[3/4] overflow-visible mb-10">
          {/* We animate this inner wrapper for motion rules so it doesn't break the crossfade timeline */}
          <div ref={imageWrapperRef} className="w-full h-full rounded-sm overflow-hidden shadow-2xl origin-center">
            <img 
              src={currentState.image} 
              alt={currentState.product} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        
        <div className={`text-center md:text-right transition-all duration-500 ${currentState.typography}`} style={{ color: currentState.textColor }}>
          <h3 className="text-5xl md:text-7xl mb-4">{currentState.product}</h3>
          <p className="font-sans text-lg md:text-2xl tracking-wide max-w-sm mx-auto md:ml-auto opacity-80" style={{ color: currentState.textColor }}>
            {currentState.description}
          </p>
        </div>
      </div>

    </section>
  );
}
