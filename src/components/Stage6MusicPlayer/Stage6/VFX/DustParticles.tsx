import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DustParticles({ isPlaying, isMobile = false }: { isPlaying: boolean, isMobile?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = isMobile ? 100 : 350;
  
  const particles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < particleCount; i++) {
      pts.push({
        position: new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15),
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() * 0.01) + 0.002, (Math.random() - 0.5) * 0.01),
        baseY: (Math.random() - 0.5) * 15
      });
    }
    return pts;
  }, [particleCount]);

  const positions = useMemo(() => {
    return new Float32Array(particleCount * 3);
  }, [particleCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    const geo = pointsRef.current.geometry as THREE.BufferGeometry;
    const posAttribute = geo.attributes.position as THREE.BufferAttribute;
    
    particles.forEach((p, i) => {
      if (isPlaying) {
        p.position.x += p.velocity.x + Math.sin(time * 0.2 + i) * 0.005;
        p.position.y += p.velocity.y + Math.cos(time * 0.1 + i) * 0.005;
        p.position.z += p.velocity.z + Math.sin(time * 0.3 + i) * 0.005;
        
        if (p.position.y > 8) p.position.y = -8;
        if (p.position.x > 8) p.position.x = -8;
        if (p.position.x < -8) p.position.x = 8;
        if (p.position.z > 8) p.position.z = -8;
        if (p.position.z < -8) p.position.z = 8;
      } else {
        p.position.y -= 0.01;
        p.position.x += Math.sin(time * 0.1 + i) * 0.001;
        
        if (p.position.y < -3) {
          p.position.y = -3;
        }
      }
      
      posAttribute.setXYZ(i, p.position.x, p.position.y, p.position.z);
    });
    
    posAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} key={particleCount}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particleCount} 
          array={positions} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        color="#ffecd6" 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
