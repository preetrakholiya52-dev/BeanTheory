import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function CoffeeBean() {
  const beanRef = useRef();
  const materialRef = useRef();
  const opacityRef = useRef({ value: 0 }); // Proxy for GSAP to tween
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!beanRef.current || !materialRef.current) return;

    // Initial state: hidden — set directly, not via gsap.set
    beanRef.current.position.y = -5;
    materialRef.current.opacity = 0;

    // Scroll trigger to enter the scene when #build-brew section arrives
    const enterTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#build-brew',
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
      }
    });

    enterTl.to(beanRef.current.position, { y: 0, duration: 1 }, 0)
           .to(opacityRef.current, { 
             value: 1, 
             duration: 1, 
             onUpdate: () => {
               if (materialRef.current) materialRef.current.opacity = opacityRef.current.value;
             }
           }, 0);

    // Exit when scrolled past
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#build-brew',
        start: 'bottom 80%',
        end: 'bottom 20%',
        scrub: 1,
      }
    });
    
    exitTl.to(beanRef.current.position, { y: 5, duration: 1 }, 0)
          .to(opacityRef.current, { 
            value: 0, 
            duration: 1, 
            onUpdate: () => {
              if (materialRef.current) materialRef.current.opacity = opacityRef.current.value;
            }
          }, 0);

    // Listen for custom event from HTML selectors
    const handleBrewChange = (e) => {
      const { beanColor } = e.detail;
      if (!beanColor || !materialRef.current) return;
      
      const targetColor = new THREE.Color(beanColor);
      // Animate the 3D material color based on the slider state
      gsap.to(materialRef.current.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      // Add a slight pop animation when sliders move
      gsap.fromTo(beanRef.current.scale, 
        { x: 1.1, y: 1.6, z: 0.9 }, 
        { x: 1, y: 1.5, z: 0.8, duration: 0.6, ease: 'elastic.out(1, 0.5)' }
      );
    };

    window.addEventListener('brewChange', handleBrewChange);

    return () => {
      enterTl.kill();
      exitTl.kill();
      window.removeEventListener('brewChange', handleBrewChange);
    };
  }, []);

  useFrame((state) => {
    if (!beanRef.current || prefersReducedMotion) return;
    
    // Abstract continuous floating animation
    const t = state.clock.getElapsedTime();
    beanRef.current.rotation.y = t * 0.2;
    beanRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    beanRef.current.position.y += Math.sin(t) * 0.002;
  });

  return (
    <group ref={beanRef} position={[0, -5, 0]}>
      {/* Abstract premium coffee bean */}
      <mesh scale={[1, 1.5, 0.8]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial 
          ref={materialRef}
          color="#1B100B"
          roughness={0.2}
          metalness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          transparent={true}
          opacity={0}
        />
      </mesh>
    </group>
  );
}
