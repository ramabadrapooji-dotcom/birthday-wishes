import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export default function AsteroidSystem({ count = 100 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { appState, finalePhase } = useAppStore();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const asteroids = useMemo(() => {
    return Array.from({ length: count }, () => {
      // Orbit properties
      const radius = 30 + Math.random() * 150;
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 40;
      const rotPhaseX = Math.random() * Math.PI * 2;
      const rotPhaseY = Math.random() * Math.PI * 2;
      const rotPhaseZ = Math.random() * Math.PI * 2;
      
      return {
        radius,
        angle,
        speed: (0.05 + Math.random() * 0.1) * (Math.random() > 0.5 ? 1 : -1),
        yOffset,
        scale: 0.2 + Math.random() * 1.5,
        rotPhaseX,
        rotPhaseY,
        rotPhaseZ,
        // Varied rotation frequencies for natural tumbling
        rotFreqX: 0.3 + Math.random() * 0.7,
        rotFreqY: 0.2 + Math.random() * 0.5,
        rotFreqZ: 0.1 + Math.random() * 0.4,
      };
    });
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const elapsed = state.clock.elapsedTime;
    let isFinalePull = appState === 'FINAL_BANG';

    asteroids.forEach((asteroid, i) => {
      // Organic sinusoidal tumbling — looks like real zero-gravity rotation
      const rx = Math.sin(elapsed * asteroid.rotFreqX + asteroid.rotPhaseX);
      const ry = Math.sin(elapsed * asteroid.rotFreqY + asteroid.rotPhaseY);
      const rz = Math.cos(elapsed * asteroid.rotFreqZ + asteroid.rotPhaseZ);
      
      // Update orbit
      if (isFinalePull) {
        asteroid.radius = THREE.MathUtils.lerp(asteroid.radius, 0, delta * 1.5);
      } else {
        asteroid.angle += asteroid.speed * delta * 0.1;
      }
      
      const x = Math.cos(asteroid.angle) * asteroid.radius;
      const z = Math.sin(asteroid.angle) * asteroid.radius;
      const y = asteroid.yOffset * (isFinalePull ? Math.max(asteroid.radius / 100, 0) : 1);

      dummy.position.set(x, y, z);
      dummy.rotation.set(rx * Math.PI, ry * Math.PI, rz * Math.PI);
      
      let currentScale = asteroid.scale * (isFinalePull ? Math.max(asteroid.radius / 100, 0) : 1);
      if (appState === 'FINAL_BANG' && finalePhase >= 2) {
          currentScale = 0;
      }
      dummy.scale.setScalar(currentScale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 1]} />
      <meshStandardMaterial 
        color="#888888" 
        roughness={0.8}
        metalness={0.2}
      />
    </instancedMesh>
  );
}
