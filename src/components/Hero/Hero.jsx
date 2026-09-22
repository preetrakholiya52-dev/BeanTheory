import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ introFinished }) {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (!introFinished) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      const h1 = textRef.current.querySelector('h1');
      const h2 = textRef.current.querySelector('h2');
      const p = textRef.current.querySelector('p');
      const buttons = ctaRef.current.children;

      // Reset initial states for entrance
      gsap.set([h1, h2, p, buttons], { opacity: 0, y: 40 });

      tl.to([h1, h2], {
        opacity: 1,
        y: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      })
      .to(p, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
      }, '-=1.0')
      .to(buttons, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      }, '-=0.8');

      // Scroll Transition (Parallax exit)
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.timeline()
          .to(textRef.current, { y: -200, opacity: 0, ease: 'none' }, 0)
          .to(ctaRef.current, { y: -150, opacity: 0, ease: 'none' }, 0)
      });
    }, heroRef);

    return () => ctx.revert();
  }, [introFinished]);

  return (
    <section 
      id="hero-section" 
      ref={heroRef} 
      className="relative w-full h-[100svh] flex items-center px-6 md:px-16 lg:px-24 pointer-events-none"
    >
      {/* Enable pointer events on the content so buttons are clickable */}
      <div className="flex flex-col justify-center max-w-2xl z-10 pt-20 pointer-events-auto" ref={textRef}>
        
        <h1 className="text-bean-accent mb-6 text-xl md:text-2xl tracking-[0.3em] font-display uppercase">
          BEAN THEORY
        </h1>
        
        <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-serif leading-[1.05] mb-8 text-bean-white">
          COFFEE, <br />
          WITHOUT <br />
          THE ORDINARY.
        </h2>
        
        <p className="text-bean-cream/70 text-lg md:text-xl font-sans tracking-wide max-w-md leading-relaxed mb-12">
          Coffee crafted for people who refuse ordinary routines.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6" ref={ctaRef}>
          <Magnetic>
            <button className="btn-primary flex items-center gap-3 group" aria-label="Explore the brew">
              EXPLORE THE BREW
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </button>
          </Magnetic>
          <Magnetic>
            <button className="btn-secondary" aria-label="Read our story">
              OUR STORY
            </button>
          </Magnetic>
        </div>

      </div>
    </section>
  );
}
