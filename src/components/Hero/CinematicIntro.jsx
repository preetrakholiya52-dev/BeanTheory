import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SplitText, SplitLines } from '../../utils/textSplitter';

export default function CinematicIntro({ onComplete }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Initialize from sessionStorage to prevent flash of intro on reload
  const [shouldRender, setShouldRender] = useState(() => {
    return !sessionStorage.getItem('bean_theory_intro_played');
  });

  useEffect(() => {
    if (!shouldRender || prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    // Lock scrolling while intro is playing
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('bean_theory_intro_played', 'true');
        
        // Unlock scrolling
        document.body.style.overflow = '';
        if (onComplete) onComplete();
        
        // Smoothly fade out the entire intro container
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => setShouldRender(false)
        });
      }
    });

    const chars = titleRef.current.querySelectorAll('.intro-char');
    const lines = taglineRef.current.querySelectorAll('.intro-line');

    // Initial setups for both elements
    gsap.set(chars, { yPercent: 120, opacity: 0, filter: 'blur(8px)', scale: 0.95 });
    gsap.set(lines, { yPercent: 120, opacity: 0, filter: 'blur(6px)', rotationX: -20 });

    // 1. Reveal "BEAN THEORY"
    tl.to(chars, {
      yPercent: 0,
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      duration: 0.8,
      ease: 'power4.out',
      stagger: 0.03
    })
    // 2. Animate "BEAN THEORY" out
    .to(chars, {
      yPercent: -100,
      opacity: 0,
      filter: 'blur(10px)',
      scale: 1.05,
      duration: 0.6,
      ease: 'power3.inOut',
      stagger: 0.015
    }, '+=0.4')
    
    // 3. Reveal Tagline
    .to(lines, {
      yPercent: 0,
      opacity: 1,
      filter: 'blur(0px)',
      rotationX: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.15
    }, '-=0.2')
    // 4. Hold tagline briefly
    .to({}, { duration: 0.5 });

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [shouldRender, prefersReducedMotion, onComplete]);

  if (!shouldRender) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bean-bg text-bean-white"
    >
      {/* Absolute positioning so they cross-fade/replace in the same space */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 ref={titleRef} className="text-5xl md:text-8xl tracking-[0.2em] uppercase font-display text-center">
          <SplitText text="BEAN THEORY" />
        </h1>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div ref={taglineRef} className="text-4xl md:text-6xl font-serif text-center italic text-bean-cream">
          <SplitLines lines={["Coffee,", "Without", "The Ordinary."]} />
        </div>
      </div>
    </div>
  );
}
