import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function CinematicCamera({ isPlaying, isMobile }: { isPlaying: boolean, isMobile: boolean }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 3, 5));
  const targetLook = useRef(new THREE.Vector3(0, 0, -2));

  useEffect(() => {
    if (isMobile) {
      if (isPlaying) {
        targetPos.current.set(0, 2.1, 3.4);
        targetLook.current.set(0, 0.45, -2);
      } else {
        targetPos.current.set(0, 2.7, 4.1);
        targetLook.current.set(0, 0.45, -2);
      }
    } else {
      if (isPlaying) {
        targetPos.current.set(0, 2.2, 3.4);
        targetLook.current.set(0, 0.35, -2);
      } else {
        targetPos.current.set(0, 2.8, 4.0);
        targetLook.current.set(0, 0.35, -2);
      }
    }
  }, [isPlaying, isMobile]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const swayX = Math.sin(time * 0.4) * 0.15;
    const swayY = Math.cos(time * 0.25) * 0.08;
    
    const finalPos = new THREE.Vector3().copy(targetPos.current).add(new THREE.Vector3(swayX, swayY, 0));
    camera.position.lerp(finalPos, 0.04);
    
    const currentLook = new THREE.Vector3().copy(targetLook.current);
    currentLook.x += swayX * 0.3;
    currentLook.y += swayY * 0.3;
    camera.lookAt(currentLook);
  });

  return null;
}
