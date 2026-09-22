import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Basic scroll animation utility for simple fade-up / reveal interactions
 */
export const setupScrollAnimation = (element, config = {}) => {
  return gsap.fromTo(
    element,
    { 
      y: config.startY || 50, 
      opacity: config.startOpacity || 0 
    },
    {
      y: 0,
      opacity: 1,
      duration: config.duration || 1,
      ease: config.ease || 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: config.start || 'top 85%',
        toggleActions: config.toggleActions || 'play none none reverse',
        ...config.scrollTrigger,
      }
    }
  );
};
