import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const moments = [
  { 
    id: 1, 
    title: 'MORNING CITY', 
    img: 'https://images.unsplash.com/photo-1498644558220-410714fc2a76?auto=format&fit=crop&w=1200&q=80',
    aspect: 'w-[70vw] md:w-[50vw] h-[60vh]',
    align: 'self-center'
  },
  { 
    id: 2, 
    title: 'DEEP FOCUS', 
    img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
    aspect: 'w-[60vw] md:w-[35vw] h-[75vh]',
    align: 'self-start mt-10'
  },
  { 
    id: 3, 
    title: 'NIGHT OWL', 
    img: 'https://images.unsplash.com/photo-1542627088-6603b66e5c54?auto=format&fit=crop&w=1200&q=80',
    aspect: 'w-[80vw] md:w-[45vw] h-[55vh]',
    align: 'self-end mb-10'
  },
  { 
    id: 4, 
    title: 'CONNECTION', 
    img: 'https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?auto=format&fit=crop&w=1200&q=80',
    aspect: 'w-[90vw] md:w-[60vw] h-[70vh]',
    align: 'self-center'
  },
  { 
    id: 5, 
    title: 'STILLNESS', 
    img: 'https://images.unsplash.com/photo-1447078806655-40579c2520d6?auto=format&fit=crop&w=1200&q=80',
    aspect: 'w-[50vw] md:w-[30vw] h-[60vh]',
    align: 'self-start mt-20'
  },
  { 
    id: 6, 
    title: 'TRANSIT', 
    img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
    aspect: 'w-[100vw] md:w-[80vw] h-[80vh]',
    align: 'self-center'
  },
];

export default function Lifestyle() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const getScrollDist = () => {
        if (!scrollContainerRef.current) return window.innerWidth * 3;
        return scrollContainerRef.current.scrollWidth - window.innerWidth;
      };

      // 1. Horizontal Scroll Timeline with pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getScrollDist()}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      // Move the horizontal container entirely to the left
      tl.to(scrollContainerRef.current, {
        x: () => -getScrollDist(),
        ease: 'none',
        duration: 1,
      }, 0);

      // 2. Inner Parallax and Image Scaling integrated directly into the pinned timeline
      imagesRef.current.forEach((img) => {
        if (!img) return;
        tl.fromTo(img, 
          { scale: 1.3, xPercent: -15 },
          {
            scale: 1,
            xPercent: 15,
            ease: 'none',
            duration: 1,
          },
          0
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="lifestyle" 
      ref={sectionRef} 
      className="relative z-10 w-full h-[100svh] bg-bean-deep overflow-hidden pointer-events-auto"
    >
      {/* Fixed Sticky Header overlapping the images with mix-blend-mode */}
      <div className="absolute top-12 left-6 md:top-20 md:left-16 z-20 mix-blend-difference text-bean-white pointer-events-none">
        <h2 className="text-5xl md:text-8xl font-display uppercase leading-[1.05] tracking-wide">
          Coffee for the<br/>moments that<br/>matter.
        </h2>
      </div>

      {/* The Horizontal Scrolling Flex Container */}
      <div 
        ref={scrollContainerRef} 
        className="flex h-full w-max px-[20vw] items-center gap-16 md:gap-32"
      >
        {moments.map((moment, index) => (
          <div 
            key={moment.id}
            className={`relative overflow-hidden flex-shrink-0 flex flex-col justify-end group ${moment.aspect} ${moment.align}`}
            data-cursor="VIEW"
          >
            {/* The Image Container */}
            <div className="w-full h-full overflow-hidden rounded-sm relative">
               <img 
                 ref={el => imagesRef.current[index] = el}
                 src={moment.img} 
                 alt={moment.title}
                 loading="lazy"
                 decoding="async" 
                 className="absolute inset-0 w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000"
               />
               
               {/* Editorial Overlay Text */}
               <div className="absolute bottom-6 left-6 mix-blend-difference text-bean-white pointer-events-none">
                 <span className="text-xs font-sans tracking-[0.3em] uppercase opacity-70 block mb-1">
                   0{moment.id}
                 </span>
                 <span className="text-xl md:text-3xl font-serif italic tracking-wide">
                   {moment.title}
                 </span>
               </div>
            </div>
          </div>
        ))}
        
        {/* Trailing padding block */}
        <div className="w-[10vw] flex-shrink-0 h-full" />
      </div>
    </section>
  );
}
