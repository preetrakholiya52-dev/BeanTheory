import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCoffeeObject() {
  const meshRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!meshRef.current || prefersReducedMotion) return;
    
    // Start hidden and scaled down beneath the screen
    gsap.set(meshRef.current.position, { y: -10, z: -5 });
    gsap.set(meshRef.current.scale, { x: 0, y: 0, z: 0 });
    gsap.set(meshRef.current.rotation, { x: 0, y: 0, z: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#final-cta',
        start: 'top bottom', // Trigger when section starts entering
        end: 'center center',
        scrub: 1
      }
    });

    // Animate into a massive imposing object in the background
    tl.to(meshRef.current.position, { y: 0, duration: 1 }, 0)
      .to(meshRef.current.scale, { x: 5, y: 7.5, z: 4, duration: 1 }, 0)
      .to(meshRef.current.rotation, { x: 0.5, y: Math.PI, duration: 1 }, 0);
      
    return () => tl.kill();
  }, [prefersReducedMotion]);

  useFrame((state) => {
    if (!meshRef.current || prefersReducedMotion) return;
    // Slow, imposing rotation
    meshRef.current.rotation.y += 0.001;
    meshRef.current.rotation.x += 0.0005;
  });

  return (
    <mesh ref={meshRef}>
      {/* Abstract massive coffee bean/drop shape */}
      <sphereGeometry args={[2, 128, 128]} />
      <MeshDistortMaterial 
        color="#050302"
        roughness={0.1}
        metalness={0.9}
        envMapIntensity={2.5}
        distort={0.25}
        speed={1.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}
