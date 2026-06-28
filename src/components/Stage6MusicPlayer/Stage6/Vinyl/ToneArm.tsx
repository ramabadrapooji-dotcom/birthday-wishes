import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ToneArm({ isPlaying, progressPercent }: { isPlaying: boolean, progressPercent: number }) {
  const armPivotRef = useRef<THREE.Group>(null);
  const headPivotRef = useRef<THREE.Group>(null);
  
  const [sequenceState, setSequenceState] = useState<'idle' | 'unlocking' | 'moving' | 'lowering' | 'playing'>('idle');
  const targetRotationY = useRef(-0.5);
  const targetRotationX = useRef(0);
  const sequenceTimer = useRef(0);

  useEffect(() => {
    if (isPlaying) {
      if (sequenceState === 'idle') {
        setSequenceState('unlocking');
        sequenceTimer.current = 0;
      }
    } else {
      setSequenceState('idle');
    }
  }, [isPlaying]);

  useFrame((state, delta) => {
    if (!armPivotRef.current || !headPivotRef.current) return;

    if (sequenceState === 'idle') {
      targetRotationY.current = 0.5;
      targetRotationX.current = 0.15;
    } else if (sequenceState === 'unlocking') {
      sequenceTimer.current += delta;
      targetRotationX.current = 0.2;
      if (sequenceTimer.current > 0.5) {
        setSequenceState('moving');
        sequenceTimer.current = 0;
      }
    } else if (sequenceState === 'moving') {
      sequenceTimer.current += delta;
      targetRotationY.current = 0.45 - (progressPercent / 100) * 0.35;
      if (sequenceTimer.current > 1.0) {
        setSequenceState('lowering');
        sequenceTimer.current = 0;
      }
    } else if (sequenceState === 'lowering') {
      sequenceTimer.current += delta;
      targetRotationX.current = -0.085;
      if (sequenceTimer.current > 0.5) {
        setSequenceState('playing');
        sequenceTimer.current = 0;
      }
    } else if (sequenceState === 'playing') {
      targetRotationY.current = 0.45 - (progressPercent / 100) * 0.35;
      targetRotationX.current = -0.085;
    }

    armPivotRef.current.rotation.y = THREE.MathUtils.lerp(
      armPivotRef.current.rotation.y, 
      targetRotationY.current, 
      0.05
    );
    
    headPivotRef.current.rotation.x = THREE.MathUtils.lerp(
      headPivotRef.current.rotation.x,
      targetRotationX.current,
      0.05
    );

    if (sequenceState === 'playing') {
      armPivotRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 50) * 0.001;
    } else {
      armPivotRef.current.position.y = THREE.MathUtils.lerp(armPivotRef.current.position.y, 0, 0.1);
    }
  });

  return (
    <group position={[1.25, 0.06, 1.1]}>
      <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.14, 32]} />
        <meshStandardMaterial color="#8a7355" metalness={0.9} roughness={0.15} />
      </mesh>
      
      <group ref={armPivotRef}>
        <group ref={headPivotRef}>
          <mesh castShadow position={[0, 0.05, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 24]} />
            <meshStandardMaterial color="#42301c" metalness={0.8} roughness={0.25} />
          </mesh>
          
          <mesh castShadow position={[0, 0.15, 0.1]} rotation={[-0.2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
            <meshStandardMaterial color="#a88c64" metalness={0.9} roughness={0.12} />
          </mesh>
          
          <mesh castShadow>
            <tubeGeometry args={[
              new THREE.CubicBezierCurve3(
                new THREE.Vector3(0, 0.28, 0.1),
                new THREE.Vector3(-0.2, 0.4, -0.2),
                new THREE.Vector3(-0.5, 0.3, -0.6),
                new THREE.Vector3(-1.0, 0.26, -1.1)
              ),
              64,
              0.035,
              16,
              false
            ]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
          
          <group position={[0, 0.28, 0.1]}>
             <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
               <cylinderGeometry args={[0.08, 0.08, 0.12, 24]} />
               <meshStandardMaterial color="#332211" metalness={0.8} roughness={0.3} />
             </mesh>
             <mesh castShadow position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
               <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
               <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.05} />
             </mesh>
          </group>

          <group position={[-1.02, 0.23, -1.15]} rotation={[0.2, -0.4, 0.2]}>
            <mesh castShadow rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
              <meshStandardMaterial color="#b5944a" metalness={0.9} roughness={0.2} />
            </mesh>

            <mesh position={[-0.042, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.01, 32]} />
              <meshStandardMaterial color="#dfdfdf" metalness={0.95} roughness={0.2} />
            </mesh>

            <mesh position={[-0.045, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[0.01, 0.12, 16]} />
              <meshStandardMaterial color="#8a7355" metalness={0.9} roughness={0.1} />
            </mesh>

            <mesh castShadow position={[0, -0.14, 0.02]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.003, 0.18, 8]} />
              <meshStandardMaterial color="#e0e0e0" metalness={0.95} roughness={0.05} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
