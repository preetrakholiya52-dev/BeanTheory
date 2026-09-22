import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    // Check for touch device to prevent rendering on mobile
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const cursor = cursorRef.current;
    
    // QuickSetters for high performance mapping (no layout thrashing)
    const setX = gsap.quickSetter(cursor, 'x', 'px');
    const setY = gsap.quickSetter(cursor, 'y', 'px');

    const handleMouseMove = (e) => {
      // Offset by half width/height to center the cursor
      setX(e.clientX - 10);
      setY(e.clientY - 10);
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.8, duration: 0.2, ease: 'power2.out' });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2, ease: 'power2.out' });
    };

    // Global listener to check if we are hovering over an element that wants a custom cursor state
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      
      if (target) {
        const text = target.getAttribute('data-cursor');
        if (text) {
          setCursorText(text);
          gsap.to(cursor, {
            width: 80,
            height: 80,
            xPercent: -35,
            yPercent: -35,
            backgroundColor: '#D95F02',
            mixBlendMode: 'normal',
            border: 'none',
            duration: 0.4,
            ease: 'expo.out'
          });
        } else {
          // It's a standard hoverable (like a button)
          gsap.to(cursor, { scale: 2, backgroundColor: 'transparent', border: '1px solid #FFF8EC', duration: 0.3, ease: 'power2.out' });
        }
      } else {
        // Reset
        setCursorText("");
        gsap.to(cursor, {
          width: 20,
          height: 20,
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          backgroundColor: '#FFF8EC',
          mixBlendMode: 'difference',
          border: 'none',
          duration: 0.4,
          ease: 'expo.out'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 w-5 h-5 bg-bean-cream rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {cursorText && (
        <span ref={textRef} className="text-[10px] font-sans font-bold tracking-widest text-bean-bg uppercase">
          {cursorText}
        </span>
      )}
    </div>
  );
}
