import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Magnetic({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const element = ref.current;
    
    // We expect a single child element to wrap
    if (!element) return;
    
    // Grab the actual child node (the button)
    const childNode = element.firstChild;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = childNode.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      // Tween the element towards the mouse, clamped slightly
      gsap.to(childNode, {
        x: x * 0.3, // Pull strength
        y: y * 0.3,
        duration: 0.8,
        ease: 'power3.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(childNode, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return React.cloneElement(children, { ref });
}
