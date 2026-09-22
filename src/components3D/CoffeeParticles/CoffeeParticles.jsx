import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// ----- Shaders -----
const vertexShader = `
uniform float uTime;
uniform float uProgress;
attribute vec3 aExplosion;
attribute vec3 aText;
varying float vAlpha;

void main() {
  vec3 pos = position;
  
  // Timing curves for the sequence
  float p1 = smoothstep(0.1, 0.4, uProgress); // Bean -> Explosion
  float p2 = smoothstep(0.4, 0.7, uProgress); // Explosion -> Text
  float p3 = smoothstep(0.7, 0.95, uProgress); // Text -> Dissolve
  
  // Interpolations
  pos = mix(pos, aExplosion, p1);
  pos = mix(pos, aText, p2);
  pos = mix(pos, aExplosion * 1.5, p3);
  
  // Gentle idle noise based on time
  pos.y += sin(uTime * 1.5 + pos.x) * 0.1 * (1.0 - p3);
  pos.x += cos(uTime * 1.5 + pos.y) * 0.1 * (1.0 - p3);
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // Size attenuation
  gl_PointSize = (18.0 / -mvPosition.z);
  
  // Fade in at start, fade out at end
  float startFade = smoothstep(0.0, 0.1, uProgress);
  float endFade = 1.0 - smoothstep(0.85, 1.0, uProgress);
  vAlpha = min(startFade, endFade) * 0.8;
}
`;

const fragmentShader = `
varying float vAlpha;
void main() {
  // Circular point
  float dist = length(gl_PointCoord - vec2(0.5));
  if(dist > 0.5) discard;
  
  gl_FragColor = vec4(0.85, 0.37, 0.01, vAlpha); // #D95F02
}
`;

export default function CoffeeParticles() {
  const groupRef = useRef();
  const shaderRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  // Particle Generation Logic
  const { positions, explosion, textPos } = useMemo(() => {
    // Optimization: fewer particles on mobile
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 4000 : 12000;
    
    const pos = new Float32Array(count * 3);
    const expl = new Float32Array(count * 3);
    const txt = new Float32Array(count * 3);

    // 1. Target: Text "BEAN THEORY"
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Draw text
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, 1024, 256);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BEAN THEORY', 512, 128);
    
    const imgData = ctx.getImageData(0, 0, 1024, 256).data;
    const validPoints = [];
    
    for(let y = 0; y < 256; y+=2) {
      for(let x = 0; x < 1024; x+=2) {
        const idx = (y * 1024 + x) * 4;
        if(imgData[idx] > 128) {
          validPoints.push({
            x: (x - 512) * 0.02,
            y: -(y - 128) * 0.02,
            z: 0
          });
        }
      }
    }
    
    // Fill arrays
    for (let i = 0; i < count; i++) {
      // Bean (Squashed sphere)
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 2.0;
      pos[i*3] = r * Math.sin(phi) * Math.cos(theta) * 1.0;
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 1.5;
      pos[i*3+2] = r * Math.cos(phi) * 0.8;

      // Explosion (Large sphere)
      const rExp = 10 + Math.random() * 20;
      const tExp = Math.random() * 2 * Math.PI;
      const pExp = Math.acos(2 * Math.random() - 1);
      expl[i*3] = rExp * Math.sin(pExp) * Math.cos(tExp);
      expl[i*3+1] = rExp * Math.sin(pExp) * Math.sin(tExp);
      expl[i*3+2] = rExp * Math.cos(pExp);
      
      // Text
      if (validPoints.length > 0) {
        const src = validPoints[i % validPoints.length];
        txt[i*3] = src.x + (Math.random() - 0.5) * 0.1;
        txt[i*3+1] = src.y + (Math.random() - 0.5) * 0.1;
        txt[i*3+2] = src.z + (Math.random() - 0.5) * 0.1;
      }
    }

    return { positions: pos, explosion: expl, textPos: txt };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 }
  }), []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#particle-section',
        start: 'top bottom', // Start animating when section enters view
        end: 'bottom top',   // Finish when it leaves
        scrub: 1,
        onUpdate: (self) => {
          if(shaderRef.current) {
            shaderRef.current.uniforms.uProgress.value = self.progress;
          }
        }
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  useFrame((state) => {
    if (prefersReducedMotion) {
      if (groupRef.current) groupRef.current.visible = false;
      return;
    }
    
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const prog = shaderRef.current.uniforms.uProgress.value;
      
      // Optimization: Completely hide mesh when outside of section bounds to save GPU
      if (groupRef.current) {
        groupRef.current.visible = prog > 0.001 && prog < 0.999;
      }
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-aExplosion" count={explosion.length / 3} array={explosion} itemSize={3} />
          <bufferAttribute attach="attributes-aText" count={textPos.length / 3} array={textPos} itemSize={3} />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
