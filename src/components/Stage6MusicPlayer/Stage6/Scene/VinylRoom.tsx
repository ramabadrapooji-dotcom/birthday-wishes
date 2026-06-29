import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { CinematicCamera } from './CinematicCamera';
import { LightingSystem } from './LightingSystem';
import { Turntable3D } from '../Vinyl/Turntable3D';
import { DustParticles } from '../VFX/DustParticles';
import { MusicParticles } from '../VFX/MusicParticles';
import { HeartParticles } from '../VFX/HeartParticles';
import { Track } from '../../types';

interface VinylRoomProps {
  currentTrack: Track;
  isPlaying: boolean;
  progressPercent: number;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
}

export function VinylRoom({ currentTrack, isPlaying, progressPercent, analyserRef }: VinylRoomProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const turntablePos: [number, number, number] = isMobile ? [0, 0.65, -2] : [-3.0, -0.25, -2];
  const turntableScale: [number, number, number] = isMobile ? [0.45, 0.45, 0.45] : [1.15, 1.15, 1.15];

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }} className="pointer-events-auto">
        <Suspense fallback={null}>
          <CinematicCamera isPlaying={isPlaying} isMobile={isMobile} />
          <LightingSystem isPlaying={isPlaying} analyserRef={analyserRef} isMobile={isMobile} />
          
          <group position={turntablePos} scale={turntableScale}>
            <Turntable3D 
              currentTrack={currentTrack} 
              isPlaying={isPlaying} 
              progressPercent={progressPercent}
              analyserRef={analyserRef} 
            />
          </group>

          <DustParticles isPlaying={isPlaying} isMobile={isMobile} />
          <MusicParticles analyserRef={analyserRef} isPlaying={isPlaying} isMobile={isMobile} />
          <HeartParticles isPlaying={isPlaying} isMobile={isMobile} />

          <EffectComposer enableNormalPass={false}>
            <Bloom 
              luminanceThreshold={0.6} 
              mipmapBlur 
              intensity={0.8} 
              radius={0.4} 
            />
            <Noise opacity={0.03} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
