import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { VinylRecord3D } from './VinylRecord3D';
import { ToneArm } from './ToneArm';
import { Track } from '../../types';

const hornPoints: THREE.Vector2[] = [];
for (let i = 0; i <= 80; i++) {
  const t = i / 80;
  const radius = 0.04 + 0.15 * t + 0.75 * Math.pow(t, 2.5);
  const y = t * 1.5;
  hornPoints.push(new THREE.Vector2(radius, y));
}

const throatPoints: THREE.Vector2[] = [];
for (let i = 0; i <= 30; i++) {
  const t = i / 30;
  const radius = 0.038 + 0.3 * Math.pow(t, 2);
  const y = t * 0.7;
  throatPoints.push(new THREE.Vector2(radius, y));
}

interface Turntable3DProps {
  currentTrack: Track;
  isPlaying: boolean;
  progressPercent: number;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
}

export function Turntable3D({ currentTrack, isPlaying, progressPercent, analyserRef }: Turntable3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hornRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const previousPointerX = useRef(0);
  const previousPointerY = useRef(0);
  const velocityY = useRef(0);
  const velocityX = useRef(0);
  const lastInteractTime = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();

      if (isDragging.current) {
        groupRef.current.rotation.y += velocityY.current;
        groupRef.current.rotation.x = Math.max(-0.25, Math.min(0.20, groupRef.current.rotation.x + velocityX.current));
        
        velocityY.current *= 0.82;
        velocityX.current *= 0.82;
        
        lastInteractTime.current = time;
      } else {
        groupRef.current.rotation.y += velocityY.current;
        groupRef.current.rotation.x = Math.max(-0.25, Math.min(0.20, groupRef.current.rotation.x + velocityX.current));
        
        velocityY.current *= 0.94;
        velocityX.current *= 0.94;

        if (time - lastInteractTime.current > 3.0) {
          groupRef.current.rotation.y += 0.12 * delta;
          groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.05, 1.5 * delta);
        }
      }
    }

    if (hornRef.current && isPlaying) {
      let bass = 0;
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        bass = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 1020;
      }
      hornRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 32) * (0.005 + bass * 0.01);
      hornRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 16) * (0.002 + bass * 0.004);
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDragging.current = true;
    previousPointerX.current = e.clientX;
    previousPointerY.current = e.clientY;
    velocityY.current = 0;
    velocityX.current = 0;
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    const deltaX = e.clientX - previousPointerX.current;
    const deltaY = e.clientY - previousPointerY.current;

    velocityY.current = deltaX * 0.007;
    velocityX.current = deltaY * 0.005;

    previousPointerX.current = e.clientX;
    previousPointerY.current = e.clientY;
  };

  const handlePointerUp = (e: any) => {
    if (isDragging.current) {
      e.stopPropagation();
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      isDragging.current = false;
    }
  };

  const woodTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#632e11';
      ctx.fillRect(0, 0, 512, 512);
      
      ctx.strokeStyle = '#3d1c07';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        let y = Math.random() * 512;
        ctx.moveTo(0, y);
        for (let x = 0; x <= 512; x += 32) {
          const wave = Math.sin((x / 512) * Math.PI * 2 + y * 0.05) * 12;
          ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }
      
      const grad = ctx.createRadialGradient(256, 256, 80, 256, 256, 360);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp}
    >
      <group position={[0, -0.65, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
          <boxGeometry args={[3.2, 0.15, 3.2]} />
          <meshStandardMaterial color="#2d1305" roughness={0.4} metalness={0.1} />
        </mesh>
        
        <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
          <boxGeometry args={[3.0, 0.15, 3.0]} />
          <meshStandardMaterial map={woodTexture} bumpMap={woodTexture} bumpScale={0.005} roughness={0.3} metalness={0.15} />
        </mesh>
        
        <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[2.8, 0.1, 2.8]} />
          <meshStandardMaterial map={woodTexture} bumpMap={woodTexture} bumpScale={0.005} roughness={0.3} metalness={0.1} />
        </mesh>

        <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
          <boxGeometry args={[2.6, 0.7, 2.6]} />
          <meshStandardMaterial map={woodTexture} bumpMap={woodTexture} bumpScale={0.005} roughness={0.3} metalness={0.2} />
        </mesh>

        {[-1.31, 1.31].map((x, i) => (
          <group key={`inlay-x-${i}`} position={[x, 0.45, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.02, 0.5, 2.2]} />
              <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
        {[-1.31, 1.31].map((z, i) => (
          <group key={`inlay-z-${i}`} position={[0, 0.45, z]}>
            <mesh castShadow>
              <boxGeometry args={[2.2, 0.5, 0.02]} />
              <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
            </mesh>
            {z > 0 && (
              <mesh position={[0, 0, 0.015]}>
                <boxGeometry args={[1.8, 0.4, 0.01]} />
                <meshStandardMaterial color="#1a0a03" roughness={0.9} />
              </mesh>
            )}
          </group>
        ))}

        <group position={[0, 0.45, 1.32]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.18, 0.02]} />
            <meshStandardMaterial color="#b5944a" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <boxGeometry args={[0.54, 0.12, 0.01]} />
            <meshStandardMaterial color="#000000" roughness={0.5} />
          </mesh>
          {[[-0.24, 0.06], [0.24, 0.06], [-0.24, -0.06], [0.24, -0.06]].map((pos, i) => (
             <mesh key={`screw-${i}`} position={[pos[0], pos[1], 0.02]} rotation={[Math.PI / 2, 0, 0]}>
               <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
               <meshStandardMaterial color="#e5c877" metalness={1.0} roughness={0.2} />
             </mesh>
          ))}
        </group>

        <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
          <boxGeometry args={[2.7, 0.1, 2.7]} />
          <meshStandardMaterial map={woodTexture} bumpMap={woodTexture} bumpScale={0.005} roughness={0.3} metalness={0.15} />
        </mesh>

        <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[2.5, 0.02, 2.5]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        
        <group position={[1.32, 0.45, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 24]} />
            <meshStandardMaterial color="#b5944a" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh castShadow position={[0, 0.22, 0.04]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.45, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.05} />
          </mesh>
          <mesh castShadow position={[0, 0.44, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.28, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.05} />
          </mesh>
          <mesh position={[0, 0.44, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.04, 0.18, 16]} />
            <meshStandardMaterial map={woodTexture} bumpMap={woodTexture} bumpScale={0.005} roughness={0.4} />
          </mesh>
        </group>
      </group>

      <group position={[0, 0.32, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.05, 1.05, 0.08, 48]} />
          <meshStandardMaterial color="#dfdfdf" metalness={0.98} roughness={0.05} />
        </mesh>
        
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[1.02, 1.02, 0.01, 32]} />
          <meshStandardMaterial color="#3a0f16" roughness={0.9} />
        </mesh>

        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.26, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.05} />
        </mesh>

        <group position={[0, 0.052, 0]}>
          <VinylRecord3D currentTrack={currentTrack} isPlaying={isPlaying} />
        </group>
      </group>

      <group position={[0, 0.32, 0]}>
        <ToneArm isPlaying={isPlaying} progressPercent={progressPercent} />

        <group ref={hornRef} position={[1.15, -0.05, -1.15]}>
          
          <mesh castShadow position={[0, 0.05, 0]}>
             <cylinderGeometry args={[0.22, 0.28, 0.1, 32]} />
             <meshStandardMaterial color="#222" roughness={0.7} metalness={0.6} />
          </mesh>
          <mesh castShadow position={[0, 0.1, 0]}>
             <cylinderGeometry args={[0.18, 0.2, 0.05, 32]} />
             <meshStandardMaterial color="#8a6914" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 0.15, 0]}>
             <torusGeometry args={[0.16, 0.04, 16, 32]} />
             <meshStandardMaterial color="#b5944a" roughness={0.2} metalness={0.9} />
          </mesh>
          
          {[0, 1, 2, 3].map((i) => (
             <mesh key={`base-screw-${i}`} castShadow position={[Math.cos(i * Math.PI / 2) * 0.22, 0.1, Math.sin(i * Math.PI / 2) * 0.22]} rotation={[0, 0, 0]}>
               <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
               <meshStandardMaterial color="#d4af37" roughness={0.4} metalness={0.8} />
             </mesh>
          ))}

          <mesh castShadow position={[0, 0.6, 0]}>
             <cylinderGeometry args={[0.06, 0.08, 0.9, 32]} />
             <meshStandardMaterial color="#c5a017" roughness={0.25} metalness={0.9} />
          </mesh>

          <mesh castShadow position={[0, 0, 0]}>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 1.05, 0),
                new THREE.Vector3(0, 1.4, 0.2),
                new THREE.Vector3(-0.15, 1.6, 0.6),
                new THREE.Vector3(-0.4, 1.7, 1.1)
              ]),
              64,
              0.06,
              32,
              false
            ]} />
            <meshStandardMaterial color="#c5a017" roughness={0.25} metalness={0.9} />
          </mesh>

          <group position={[-0.4, 1.7, 1.1]} rotation={[-0.2, 0.15, 0]}>
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
               <cylinderGeometry args={[0.08, 0.06, 0.15, 32]} />
               <meshStandardMaterial color="#b5944a" roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.075]}>
               <torusGeometry args={[0.09, 0.02, 16, 32]} />
               <meshStandardMaterial color="#d4af37" roughness={0.2} metalness={0.95} />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <mesh key={`screw-${i}`} castShadow position={[Math.cos(i * Math.PI / 3) * 0.1, Math.sin(i * Math.PI / 3) * 0.1, 0.075]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.03, 8]} />
                <meshStandardMaterial color="#8a6914" roughness={0.4} metalness={0.8} />
              </mesh>
            ))}

            <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.1]}>
              <latheGeometry args={[hornPoints, 128]} />
              <meshStandardMaterial 
                color="#e5c158" 
                metalness={0.95} 
                roughness={0.15} 
                side={THREE.DoubleSide} 
              />
              
              <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.94, 0.025, 32, 128]} />
                <meshStandardMaterial color="#f2d26f" metalness={1.0} roughness={0.1} />
              </mesh>
              
              <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.52, 0.015, 16, 64]} />
                <meshStandardMaterial color="#8a6914" metalness={0.9} roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.22, 0.012, 16, 64]} />
                <meshStandardMaterial color="#8a6914" metalness={0.9} roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.11, 0.01, 16, 64]} />
                <meshStandardMaterial color="#8a6914" metalness={0.9} roughness={0.4} />
              </mesh>
            </mesh>
            
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.11]}>
               <latheGeometry args={[throatPoints, 64]} />
              <meshStandardMaterial color="#2a1e05" metalness={0.6} roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
