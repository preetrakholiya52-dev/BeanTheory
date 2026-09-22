import React, { useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

export default function ProductRow({ product, onHover, onLeave }) {
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const detailsRef = useRef(null);
  const arrowRef = useRef(null);

  const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

  const handleMouseEnter = () => {
    if (!isDesktop()) return;
    onHover();
    
    gsap.to(imageRef.current, { scale: 1, opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' });
    gsap.to(textRef.current, { x: 30, duration: 0.7, ease: 'power3.out' });
    gsap.to(detailsRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 });
    gsap.to(arrowRef.current, { x: 15, rotation: -45, duration: 0.5, ease: 'power3.out' });
  };

  const handleMouseLeave = () => {
    if (!isDesktop()) return;
    onLeave();
    
    gsap.to(imageRef.current, { scale: 0.85, opacity: 0, x: 40, duration: 0.5, ease: 'power3.out' });
    gsap.to(textRef.current, { x: 0, duration: 0.5, ease: 'power3.out' });
    gsap.to(detailsRef.current, { opacity: 0, y: 15, duration: 0.5, ease: 'power3.out' });
    gsap.to(arrowRef.current, { x: 0, rotation: 0, duration: 0.5, ease: 'power3.out' });
  };

  return (
    <div 
      className="group relative flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-16 py-12 md:py-20 border-b border-bean-white/10 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="EXPLORE"
      tabIndex={0}
      role="button"
      aria-label={`Explore ${product.title}`}
    >
      {/* Mobile Image (Visible only on mobile, stacked cleanly) */}
      <div className="w-full h-64 md:hidden mb-8 overflow-hidden rounded-sm">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover grayscale opacity-80" />
      </div>

      {/* Number & Title */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-16 z-10" ref={textRef}>
        <span className="text-xl md:text-3xl font-serif italic text-bean-white/30 group-hover:text-bean-accent transition-colors duration-500">
          {product.number}
        </span>
        <h4 className="text-4xl md:text-6xl lg:text-7xl font-display text-bean-white uppercase tracking-wide group-hover:text-bean-cream transition-colors duration-500">
          {product.title}
        </h4>
      </div>

      {/* Flavor Details (Fades in on hover on desktop, always visible underneath on mobile) */}
      <div 
        ref={detailsRef}
        className="mt-6 md:mt-0 md:absolute md:left-[55%] md:-translate-x-1/2 flex flex-col gap-3 z-10 md:opacity-0 md:translate-y-4 pointer-events-none"
      >
        <span className="text-[10px] md:text-xs font-sans tracking-[0.2em] text-bean-accent uppercase">
          Tasting Notes
        </span>
        <p className="font-serif italic text-bean-cream text-xl md:text-2xl max-w-sm">
          {product.notes}
        </p>
      </div>

      {/* Right side CTA / Hover Image on Desktop */}
      <div className="hidden md:flex items-center gap-12 z-10">
        
        {/* The absolute positioning lets the image float over the row boundaries slightly */}
        <div className="absolute right-40 top-1/2 -translate-y-1/2 w-[320px] h-[400px] pointer-events-none z-0">
           <img 
             ref={imageRef}
             src={product.image} 
             alt={product.title} 
             className="absolute inset-0 w-full h-full object-cover opacity-0 scale-90 translate-x-10 grayscale hover:grayscale-0 transition-all duration-700 rounded-sm" 
           />
        </div>
        
        <div ref={arrowRef} className="text-bean-white/50 group-hover:text-bean-accent transition-colors z-10">
          <ArrowRight className="w-10 h-10" strokeWidth={1} />
        </div>
      </div>
      
      {/* Mobile CTA */}
      <div className="flex md:hidden items-center gap-3 mt-8 text-bean-accent uppercase font-sans text-xs tracking-[0.2em] font-semibold border border-bean-accent/30 px-6 py-3 rounded-sm">
        <span>Explore</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}
