import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function HeartParticles({ isPlaying, isMobile = false }: { isPlaying: boolean, isMobile?: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = isMobile ? 40 : 80;
  
  const { geometry, particles } = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2.0, y, x, y);
    shape.bezierCurveTo(x - 3.0, y, x - 3.0, y + 3.5, x - 3.0, y + 3.5);
    shape.bezierCurveTo(x - 3.0, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6.0, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5);
    shape.bezierCurveTo(x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const geo = new THREE.ShapeGeometry(shape);
    geo.center();
    geo.scale(0.015, -0.015, 0.015);

    const colors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#f0d57d', '#ffffff'];
    
    const pts = [];
    for (let i = 0; i < count; i++) {
      pts.push({
        position: new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8 + 2, (Math.random() - 0.5) * 8),
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.015, (Math.random() * 0.015) + 0.005, (Math.random() - 0.5) * 0.015),
        rotation: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        rotVelocity: new THREE.Vector3((Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03),
        color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
        baseY: (Math.random() - 0.5) * 6,
      });
    }
    
    return { geometry: geo, particles: pts };
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    particles.forEach((p, i) => {
      p.color.toArray(arr, i * 3);
    });
    return arr;
  }, [particles, count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    particles.forEach((p, i) => {
      if (isPlaying) {
        p.position.y += p.velocity.y + Math.sin(time * 0.5 + i) * 0.003;
        p.position.x += p.velocity.x + Math.cos(time * 0.4 + i) * 0.004;
        p.position.z += p.velocity.z + Math.sin(time * 0.6 + i) * 0.003;
        
        p.rotation.x += p.rotVelocity.x;
        p.rotation.y += p.rotVelocity.y;
        p.rotation.z += p.rotVelocity.z;
        
        if (p.position.y > 6) p.position.y = -2;
        if (p.position.x > 5) p.position.x = -5;
        if (p.position.x < -5) p.position.x = 5;
        if (p.position.z > 5) p.position.z = -5;
        if (p.position.z < -5) p.position.z = 5;
        
      } else {
        p.position.y -= 0.01;
        p.rotation.x += p.rotVelocity.x * 0.3;
        p.rotation.y += p.rotVelocity.y * 0.3;
        
        if (p.position.y < -3) {
          p.position.y = -3; 
        }
      }
      
      dummy.position.copy(p.position);
      dummy.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
      
      const scale = isPlaying ? 1.0 + Math.sin(time * 2 + i) * 0.2 : 1.0;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]} key={count}>
      <meshBasicMaterial transparent opacity={0.7} side={THREE.DoubleSide} />
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
}
