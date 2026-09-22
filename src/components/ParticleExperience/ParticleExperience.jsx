import React from 'react';

export default function ParticleExperience() {
  return (
    <section 
      id="particle-section" 
      className="relative w-full h-[400svh] pointer-events-none"
    >
      {/* 
        This is a tall section to give the user enough scroll distance 
        to appreciate the complex 3D particle morphing animation.
      */}
      <div className="sticky top-0 w-full h-[100svh] flex items-center justify-center pointer-events-none z-10 mix-blend-difference">
         <h2 className="text-bean-cream tracking-[0.5em] md:tracking-[1em] font-sans text-xs md:text-sm uppercase font-semibold text-center px-4">
           Every bean has a story.
         </h2>
      </div>
    </section>
  );
}
