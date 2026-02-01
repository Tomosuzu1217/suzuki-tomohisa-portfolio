import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WaveShaderMaterial = {
  vertexShader: `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Simplified wave calculation
      float slowTime = uTime * 0.12;
      float elevation = sin(pos.x * 0.3 + slowTime) * 0.15 + 
                       cos(pos.y * 0.25 + slowTime) * 0.15;
      
      pos.z += elevation;
      vElevation = elevation;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float vElevation;

    uniform vec3 uColor;
    uniform vec3 uSurface;
    uniform vec3 uHighlight;

    void main() {
      vec3 color = mix(uColor, uSurface, vElevation * 0.3 + 0.4);
      color += uHighlight * 0.1;
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const SimplePlane = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#0a0a0a') },
        uSurface: { value: new THREE.Color('#1f1f1f') },
        uHighlight: { value: new THREE.Color('#4a3b20') },
      },
      vertexShader: WaveShaderMaterial.vertexShader,
      fragmentShader: WaveShaderMaterial.fragmentShader,
      side: THREE.FrontSide,
    });
  }, []);

  return (
    // Reduced geometry segments: 128x128 -> 32x32
    <mesh rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, -5]}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <primitive object={material} ref={materialRef} attach="material" />
    </mesh>
  );
};

// Lightweight version for hero section only
export const WaterBackgroundHero: React.FC = () => {
  const [shouldRender, setShouldRender] = useState(true);

  // Disable on mobile for performance
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setShouldRender(!isMobile);
  }, []);

  if (!shouldRender) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#1a1a1a]" />
    );
  }

  return (
    <div className="absolute inset-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={1}>
        <SimplePlane />
      </Canvas>
    </div>
  );
};

// Simple gradient background for other sections
export const WaterBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none bg-[#141414]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#1a1a1a]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C5A265]/20 via-transparent to-transparent" />
    </div>
  );
};