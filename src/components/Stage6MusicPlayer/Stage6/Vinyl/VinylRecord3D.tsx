import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Track } from '../../types';

export function VinylRecord3D({ currentTrack, isPlaying }: { currentTrack: Track, isPlaying: boolean }) {
  const vinylRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentTrack.cover;
    img.onload = () => {
      if (!active) return;
      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      setTexture(tex);
    };
    img.onerror = () => {
      if (!active) return;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
        grad.addColorStop(0, '#ec4899');
        grad.addColorStop(0.5, '#a21caf');
        grad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(256, 256, 180, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(256, 256, 120, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("EXCLUSIVE", 256, 220);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '18px monospace';
        ctx.fillText("BIRTHDAY MOMENT", 256, 270);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      setTexture(tex);
    };

    return () => {
      active = false;
    };
  }, [currentTrack.cover]);

  const grooveTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, 1024, 1024);
      
      const centerX = 512;
      const centerY = 512;
      
      ctx.lineWidth = 1;
      for (let r = 180; r < 500; r += 2) {
        const shade = Math.floor(Math.random() * 40);
        ctx.strokeStyle = `rgb(${shade}, ${shade}, ${shade})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  useFrame((_, delta) => {
    if (isPlaying && vinylRef.current) {
      vinylRef.current.rotation.y -= 1.5 * delta; 
    }
  });

  return (
    <group ref={vinylRef} position={[0, 0.06, 0]}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.06, 64]} />
        <meshStandardMaterial 
          color="#050505" 
          roughness={0.4} 
          metalness={0.9}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.031, 0]}>
        <ringGeometry args={[0.5, 1.48, 64]} />
        <meshStandardMaterial 
          map={grooveTexture}
          bumpMap={grooveTexture}
          bumpScale={0.005}
          color="#111" 
          roughness={0.3} 
          metalness={0.9} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.032, 0]}>
        <ringGeometry args={[0.03, 0.5, 64]} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.6} side={THREE.DoubleSide} />
        ) : (
          <meshStandardMaterial color="#ec4899" roughness={0.5} side={THREE.DoubleSide} />
        )}
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.033, 0]}>
        <ringGeometry args={[0.03, 1.5, 64]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.06} 
          roughness={0.1} 
          metalness={0.8} 
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
