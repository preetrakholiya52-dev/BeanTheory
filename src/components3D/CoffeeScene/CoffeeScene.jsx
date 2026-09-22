import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import CoffeeCup from '../CoffeeCup/CoffeeCup';
import CoffeeGlobe from '../CoffeeGlobe/CoffeeGlobe';
import CoffeeBean from '../CoffeeBean/CoffeeBean';
import CoffeeParticles from '../CoffeeParticles/CoffeeParticles';
import FinalCoffeeObject from '../FinalCoffeeObject/FinalCoffeeObject';

export default function CoffeeScene({ introFinished }) {
  // Mobile devices often have high DPR but weak GPUs, limit to 1
  const isMobile = window.innerWidth < 768;
  const dpr = isMobile ? 1 : [1, 1.5];

  return (
    <Canvas
      eventSource={document.getElementById('root')}
      eventPrefix="client"
      shadows="basic"
      camera={{ position: [0, 0, 10], fov: 45 }}
      dpr={dpr}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <PerformanceMonitor onDecline={() => {}}>
        <color attach="background" args={['#090909']} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={2} castShadow shadow-mapSize={[1024, 1024]} />
        <spotLight position={[-5, 5, 10]} angle={0.25} penumbra={1} intensity={3} color="#D95F02" />
        
        <Suspense fallback={null}>
          <Environment preset="studio" />
          
          <CoffeeCup introFinished={introFinished} />
          <CoffeeGlobe />
          <CoffeeBean />
          <CoffeeParticles />
          <FinalCoffeeObject />
          
          {/* Subtle grounded shadow for realism */}
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.6} 
            scale={25} 
            blur={2.5} 
            far={10} 
            resolution={512} 
            color="#000000" 
          />
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
}
