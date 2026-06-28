import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function MusicParticles({ analyserRef, isPlaying, isMobile = false }: { analyserRef: React.MutableRefObject<AnalyserNode | null>, isPlaying: boolean, isMobile?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = isMobile ? 50 : 150;
  
  const originalPositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.random() * 4 - 1;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [particleCount]);

  const currentPositions = useMemo(() => new Float32Array(originalPositions), [originalPositions]);

  useFrame((state) => {
    if (!pointsRef.current || !isPlaying) return;

    let mid = 0;
    if (analyserRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);
      const midRange = data.slice(10, 50);
      mid = midRange.reduce((a, b) => a + b, 0) / midRange.length / 255;
    }

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];
      const oz = originalPositions[i * 3 + 2];

      const angleOffset = time * 0.2 + i * 0.1;
      
      const expansion = 1 + mid * 1.5;

      positions[i * 3] = ox * expansion * Math.cos(angleOffset) - oz * expansion * Math.sin(angleOffset);
      positions[i * 3 + 1] = oy + Math.sin(time * 2 + i) * 0.2 + (mid * 2);
      positions[i * 3 + 2] = ox * expansion * Math.sin(angleOffset) + oz * expansion * Math.cos(angleOffset);
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    (pointsRef.current.material as THREE.PointsMaterial).opacity = 0.2 + mid * 0.6;
    (pointsRef.current.material as THREE.PointsMaterial).size = 0.05 + mid * 0.1;
  });

  return (
    <points ref={pointsRef} key={particleCount}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particleCount} 
          array={currentPositions} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#ec4899" 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
