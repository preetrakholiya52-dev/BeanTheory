import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function CoffeeCup({ introFinished }) {
  const scrollGroup = useRef();
  const floatGroup = useRef();
  const prefersReducedMotion = useReducedMotion();

  // Calculate responsive resting position
  const getRestPos = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    if (width < 768) {
      return { x: 0, y: -1.2, z: -1 };
    }
    if (width < 1024) {
      return { x: 1.6, y: -0.2, z: 0 };
    }
    return { x: 2.2, y: -0.1, z: 0 };
  };

  const restRot = {
    x: 0.2,
    y: Math.PI * 2 - Math.PI / 6,
    z: 0
  };

  useEffect(() => {
    if (!scrollGroup.current) return;

    const restPos = getRestPos();

    let scrollTriggerInstance = null;

    const setupScrollAnimation = () => {
      if (scrollTriggerInstance) scrollTriggerInstance.kill();

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          immediateRender: false,
          onLeave: () => {
            if (scrollGroup.current) {
              scrollGroup.current.visible = false;
            }
          },
          onEnterBack: () => {
            if (scrollGroup.current) {
              scrollGroup.current.visible = true;
            }
          }
        }
      });

      scrollTl.fromTo(scrollGroup.current.position,
        { x: restPos.x, y: restPos.y, z: restPos.z },
        { x: restPos.x + 3, y: 12, z: -5, ease: 'power1.in' },
        0
      );

      scrollTl.fromTo(scrollGroup.current.rotation,
        { x: restRot.x, y: restRot.y, z: restRot.z },
        { x: 0.5, y: restRot.y + Math.PI, z: 0.3, ease: 'power1.in' },
        0
      );

      // Scale completely down to 0 so it disappears completely
      scrollTl.fromTo(scrollGroup.current.scale,
        { x: 1, y: 1, z: 1 },
        { x: 0, y: 0, z: 0, ease: 'power1.in' },
        0
      );

      scrollTriggerInstance = scrollTl.scrollTrigger;

      // Ensure proper visibility state on initial mount if already scrolled past hero
      const heroEl = document.getElementById('hero-section');
      const isPast = heroEl ? heroEl.getBoundingClientRect().bottom <= 0 : window.scrollY > 300;
      if (isPast && scrollGroup.current) {
        scrollGroup.current.visible = false;
        scrollGroup.current.scale.set(0, 0, 0);
        scrollGroup.current.position.set(restPos.x + 3, 12, -5);
      }
    };

    if (introFinished) {
      // If user has already scrolled past hero, do not play hero entrance
      const heroEl = document.getElementById('hero-section');
      const isPast = heroEl ? heroEl.getBoundingClientRect().bottom <= 0 : window.scrollY > 300;

      if (!isPast) {
        scrollGroup.current.visible = true;
        // Animate in smoothly from beneath the frame
        scrollGroup.current.position.set(restPos.x, -5, restPos.z);
        scrollGroup.current.rotation.set(0.2, -Math.PI / 4, 0);
        scrollGroup.current.scale.set(1, 1, 1);

        gsap.to(scrollGroup.current.position, {
          x: restPos.x,
          y: restPos.y,
          z: restPos.z,
          duration: 1.8,
          ease: 'power3.out',
          onComplete: () => {
            setupScrollAnimation();
          }
        });

        gsap.to(scrollGroup.current.rotation, {
          x: restRot.x,
          y: restRot.y,
          z: restRot.z,
          duration: 2.2,
          ease: 'power3.out',
        });
      } else {
        // Already scrolled, immediately hide and bind ScrollTrigger
        scrollGroup.current.visible = false;
        scrollGroup.current.position.set(restPos.x + 3, 12, -5);
        scrollGroup.current.scale.set(0, 0, 0);
        setupScrollAnimation();
      }
    } else {
      // Hidden below until intro finishes
      scrollGroup.current.visible = false;
      scrollGroup.current.position.set(restPos.x, -6, restPos.z);
    }

    return () => {
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    };
  }, [introFinished]);

  // Subtle Mouse Parallax & Float on inner group (isolated from GSAP scroll)
  useFrame((state) => {
    if (!floatGroup.current || prefersReducedMotion || !scrollGroup.current?.visible) return;
    
    const t = state.clock.getElapsedTime();
    
    // Smooth floating oscillation
    floatGroup.current.position.y = Math.sin(t * 1.5) * 0.06;
    
    // Subtle tilt based on mouse pointer
    const targetTiltX = state.pointer.y * 0.08;
    const targetTiltZ = -state.pointer.x * 0.06;
    
    floatGroup.current.rotation.x = gsap.utils.interpolate(floatGroup.current.rotation.x, targetTiltX, 0.05);
    floatGroup.current.rotation.z = gsap.utils.interpolate(floatGroup.current.rotation.z, targetTiltZ, 0.05);
  });

  return (
    <group ref={scrollGroup}>
      <group ref={floatGroup}>

      {/* Cup Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.4, 1.0, 3.2, 64]} />
        <meshPhysicalMaterial 
          color="#111111"
          roughness={0.15}
          metalness={0.7}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Coffee Inside */}
      <mesh position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.32, 1.32, 0.05, 64]} />
        <meshStandardMaterial 
          color="#1B100B" 
          roughness={0.1} 
          metalness={0.1}
        />
      </mesh>

      {/* Cup Handle */}
      <mesh position={[1.55, 0.2, 0]} rotation={[0, 0, -Math.PI / 14]} castShadow>
        <torusGeometry args={[0.9, 0.2, 32, 64]} />
        <meshPhysicalMaterial 
          color="#111111"
          roughness={0.15}
          metalness={0.7}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Premium Gold Accent Rim */}
      <mesh position={[0, 1.6, 0]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[1.4, 0.04, 16, 64]} />
        <meshStandardMaterial 
          color="#D95F02" 
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      </group>
    </group>

  );
}

