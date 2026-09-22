import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const sectionRef = useRef(null);
  const textWrapperRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Background color shifts to slightly warmer dark tone
      gsap.to(sectionRef.current, {
        backgroundColor: '#110a07',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'center center',
          scrub: true
        }
      });

      // Typography reveals line by line using y translation
      if (textWrapperRef.current) {
        const lines = textWrapperRef.current.children;
        gsap.fromTo(lines, 
          { y: 150, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            stagger: 0.15, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'center center',
              scrub: 1
            }
          }
        );
      }

      // Button scales up and fades in
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { scale: 0.8, opacity: 0, y: 30 },
          { 
            scale: 1, 
            opacity: 1, 
            y: 0, 
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 50%',
              end: 'center center',
              scrub: 1
            }
          }
        );
      }
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="final-cta"
      className="relative w-full h-[100svh] flex flex-col items-center justify-center pointer-events-auto overflow-hidden bg-bean-bg z-10"
    >
      <div className="z-10 flex flex-col items-center text-center px-6">
        
        <h2 ref={textWrapperRef} className="text-6xl md:text-8xl lg:text-[10vw] font-display uppercase leading-[0.85] text-bean-cream mb-16 flex flex-col overflow-hidden drop-shadow-2xl">
          <span className="block translate-y-full">Ready to</span>
          <span className="block translate-y-full">Break the</span>
          <span className="block translate-y-full text-bean-accent italic">Routine?</span>
        </h2>
        
        <div ref={buttonRef}>
          <Magnetic>
            <button 
              aria-label="Get your coffee"
              className="group relative px-10 py-5 border border-bean-white/30 rounded-sm font-sans tracking-[0.2em] text-sm md:text-base uppercase text-bean-white overflow-hidden transition-all duration-300 hover:border-bean-accent bg-bean-bg/50 backdrop-blur-md focus:outline-bean-accent"
            >
              <div className="absolute inset-0 bg-bean-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
              <span className="relative z-10 flex items-center gap-4 transition-colors duration-500 group-hover:text-bean-bg font-bold">
                Get your coffee <span className="group-hover:translate-x-3 transition-transform duration-300">→</span>
              </span>
            </button>
          </Magnetic>
        </div>

      </div>
    </section>
  );
}
