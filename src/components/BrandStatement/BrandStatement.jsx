import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BrandStatement() {
  const sectionRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Create a timeline that scrubs with the scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        }
      });

      // Animate background slightly for a cinematic shift
      tl.to(sectionRef.current, {
        backgroundColor: '#1B100B', // bean-deep
        duration: 1
      }, 0);

      // Text 1 mask reveal
      tl.fromTo(text1Ref.current, 
        { yPercent: 120, rotationX: -10, opacity: 0 },
        { yPercent: 0, rotationX: 0, opacity: 1, duration: 1.5, ease: 'power4.out' }, 
        0
      );

      // Text 2 mask reveal with delay
      tl.fromTo(text2Ref.current,
        { yPercent: 120, rotationX: -10, opacity: 0 },
        { yPercent: 0, rotationX: 0, opacity: 1, duration: 1.5, ease: 'power4.out' },
        0.8
      );
      
      // Parallax out as you continue scrolling
      tl.to([text1Ref.current, text2Ref.current], {
        y: -150,
        opacity: 0,
        duration: 2,
        stagger: 0.2
      }, 4);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="brand-statement"
      className="relative w-full min-h-[120svh] flex flex-col items-center justify-center px-6 md:px-16 overflow-hidden pointer-events-auto"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="max-w-5xl w-full text-center z-10 flex flex-col gap-6 md:gap-10">
        <div className="overflow-hidden py-2 perspective-1000">
          <h2 
            ref={text1Ref}
            className="text-4xl md:text-6xl lg:text-8xl font-display uppercase leading-[1.1] text-bean-cream tracking-wide origin-bottom"
          >
            Coffee should wake you up.
          </h2>
        </div>
        <div className="overflow-hidden py-2 perspective-1000">
          <h2 
            ref={text2Ref}
            className="text-4xl md:text-6xl lg:text-8xl font-serif italic leading-[1.1] text-bean-accent origin-bottom"
          >
            Not blend into the background.
          </h2>
        </div>
      </div>
    </section>
  );
}
