import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { originsData } from '../../data/origins';

gsap.registerPlugin(ScrollTrigger);

export default function CoffeeGlobe() {
  const globeRef = useRef();
  const materialRef = useRef();
  const dotsRef = useRef();
  // Proxy objects for GSAP — Three.js materials can't be tweened directly with opacity
  const matOpacity = useRef({ value: 0 });
  const dotsOpacity = useRef({ value: 0 });

  useEffect(() => {
    if (!globeRef.current) return;

    // Initial state: hidden, offset to the right and bottom
    globeRef.current.position.set(3, -8, -2);
    if (materialRef.current) materialRef.current.opacity = 0;
    if (dotsRef.current) dotsRef.current.opacity = 0;

    // Sync helper
    const syncOpacity = () => {
      if (materialRef.current) materialRef.current.opacity = matOpacity.current.value;
      if (dotsRef.current) dotsRef.current.opacity = dotsOpacity.current.value;
    };

    // 1. Enter the globe as the #origin-journey section comes into view
    const enterTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#origin-journey',
        start: 'top bottom', 
        end: 'top center',
        scrub: 1,
      }
    });

    enterTl.to(globeRef.current.position, { y: 0, duration: 1 }, 0)
           .to(matOpacity.current, { value: 0.3, duration: 1, onUpdate: syncOpacity }, 0)
           .to(dotsOpacity.current, { value: 0.8, duration: 1, onUpdate: syncOpacity }, 0)
           .to(globeRef.current.rotation, { 
             x: originsData[0].rotation.x, 
             y: originsData[0].rotation.y, 
             duration: 1 
           }, 0);
           
    // 2. Rotate the globe matching the Pinned HTML cards
    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#origin-journey',
        start: 'top top',
        end: '+=300%', // Match the HTML pin duration
        scrub: 1,
      }
    });

    pinTl.to(globeRef.current.rotation, {
      x: originsData[1].rotation.x,
      y: originsData[1].rotation.y,
      z: originsData[1].rotation.z,
      duration: 2,
      ease: 'power1.inOut'
    }, 1) // Delay matches the fade in of Brazil
    .to(globeRef.current.rotation, {
      x: originsData[2].rotation.x,
      y: originsData[2].rotation.y,
      z: originsData[2].rotation.z,
      duration: 2,
      ease: 'power1.inOut'
    }, 3); // Delay matches fade in of Colombia

    // 3. Exit the globe when scrolling past the section
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#origin-journey',
        start: 'bottom top', 
        end: 'bottom -100%',
        scrub: 1,
      }
    });

    exitTl.to(globeRef.current.position, { y: 8, duration: 1 }, 0)
          .to(matOpacity.current, { value: 0, duration: 1, onUpdate: syncOpacity }, 0)
          .to(dotsOpacity.current, { value: 0, duration: 1, onUpdate: syncOpacity }, 0);

    return () => {
      enterTl.kill();
      pinTl.kill();
      exitTl.kill();
    };
  }, []);

  useFrame((state) => {
    if (globeRef.current) {
      // Subtle idle rotation overlaying the scroll rotation
      globeRef.current.rotation.y += 0.0005;
      globeRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
    }
  });

  return (
    <group ref={globeRef} position={[3, 0, 0]}>
      {/* Premium Stylized Globe - Wireframe */}
      <mesh>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#5A321F" 
          wireframe={true} 
          transparent={true}
          opacity={0}
        />
      </mesh>
      
      {/* Outer Glow / Particles Layer */}
      <mesh>
        <sphereGeometry args={[2.82, 64, 64]} />
        <pointsMaterial 
          ref={dotsRef}
          color="#D95F02" 
          size={0.02} 
          transparent 
          opacity={0} 
        />
      </mesh>

      {/* Solid Inner Core for Depth */}
      <mesh>
        <sphereGeometry args={[2.7, 32, 32]} />
        <meshBasicMaterial color="#090909" />
      </mesh>
    </group>
  );
}
