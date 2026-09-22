import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { originsData } from '../../data/origins';

gsap.registerPlugin(ScrollTrigger);

export default function OriginJourney() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Pin the section for 300% of its height to scrub through the 3 origins
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
        }
      });
      
      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length < 3) return;

      // Initial states
      gsap.set(validCards, { clipPath: 'inset(0 0 100% 0)' });
      gsap.set(validCards[0], { clipPath: 'inset(0 0 0% 0)' });
      
      // Step 1: Slide Card 0 up into mask, slide Card 1 up out of mask
      tl.to(validCards[0], { clipPath: 'inset(100% 0 0 0)', yPercent: -20, duration: 1, ease: 'power2.inOut' }, 1)
        .fromTo(validCards[1], { clipPath: 'inset(0 0 100% 0)', yPercent: 20 }, { clipPath: 'inset(0 0 0% 0)', yPercent: 0, duration: 1, ease: 'power2.inOut' }, 1);
        
      // Step 2: Slide Card 1 up, Slide Card 2 up
      tl.to(validCards[1], { clipPath: 'inset(100% 0 0 0)', yPercent: -20, duration: 1, ease: 'power2.inOut' }, 3)
        .fromTo(validCards[2], { clipPath: 'inset(0 0 100% 0)', yPercent: 20 }, { clipPath: 'inset(0 0 0% 0)', yPercent: 0, duration: 1, ease: 'power2.inOut' }, 3);
        
      // End of Pin: Card 2 stays visible until unpinned and scrolled past
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="origin-journey"
      className="relative w-full h-[100svh] flex items-center px-6 md:px-16 pointer-events-auto overflow-hidden bg-bean-bg"
    >
      <div className="relative w-full max-w-xl z-10 h-full flex flex-col justify-center" ref={containerRef}>
        
        <div className="absolute top-[20%] uppercase tracking-[0.3em] text-bean-accent font-sans text-xs md:text-sm mb-8 font-semibold">
          The Origin Journey
        </div>

        {originsData.map((origin, index) => (
          <div 
            key={origin.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="absolute top-1/2 -translate-y-1/2 w-full flex flex-col gap-6"
            style={{ 
              pointerEvents: index === 0 ? 'auto' : 'none' 
            }}
          >
            <h3 className="text-6xl md:text-8xl font-display text-bean-white tracking-wider uppercase">
              {origin.country}
            </h3>
            
            <div className="flex gap-12 border-t border-bean-white/10 pt-6 mt-2">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] md:text-xs font-sans tracking-[0.2em] text-bean-white/50 uppercase">Altitude</span>
                <span className="font-serif text-bean-cream text-lg md:text-xl">{origin.altitude}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] md:text-xs font-sans tracking-[0.2em] text-bean-white/50 uppercase">Roast</span>
                <span className="font-serif text-bean-cream text-lg md:text-xl">{origin.roast}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-4">
              <span className="text-[10px] md:text-xs font-sans tracking-[0.2em] text-bean-white/50 uppercase">Tasting Notes</span>
              <span className="font-sans font-light text-bean-white text-lg md:text-2xl tracking-wide">{origin.notes}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
