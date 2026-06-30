import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';
import { detectDeviceQuality, getQualitySettings } from '../utils/performance';
import CameraController from './CameraController';
import ParticleSystem from './systems/ParticleSystem';
import HyperspaceSystem from './systems/HyperspaceSystem';
import NebulaSystem from './systems/NebulaSystem';
import GalaxySystem from './systems/GalaxySystem';
import AsteroidSystem from './systems/AsteroidSystem';
import MeteorSystem from './systems/MeteorSystem';
import MemorySystem from './systems/MemorySystem';
import FinaleSystem from './systems/FinaleSystem';
import PostProcessingSystem from './systems/PostProcessingSystem';
import { SafeCanvas } from './SafeCanvas';
import { ErrorBoundary } from './ErrorBoundary';
import { Stats } from '@react-three/drei';
import { usePerformanceGuard } from '../utils/PerformanceGuard';

export default function UniverseEngine() {
  const { setQuality, quality, appState } = useAppStore();
  
  // Real-time dynamic budget system
  usePerformanceGuard();
  
  // Staged loading state
  const [loadStage, setLoadStage] = useState(0);

  useEffect(() => {
    setQuality(detectDeviceQuality());
    
    // Stage 1: Fast basic rendering
    setLoadStage(1);
    
    // Stage 2: Load heavy shaders (Nebulas, etc)
    const t2 = setTimeout(() => setLoadStage(2), 500);
    
    // Stage 3: Load interactive/props
    const t3 = setTimeout(() => setLoadStage(3), 1500);
    
    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [setQuality]);

  const settings = getQualitySettings(quality);

  return (
    <SafeCanvas
      gl={{ 
        antialias: false,
        powerPreference: 'high-performance'
      }}
      dpr={settings.pixelRatio}
      camera={{ position: [0, 0, 0], fov: 60, near: 0.1, far: 3000 }}
      onCreated={({ gl, scene }) => {
        scene.background = new THREE.Color('#020205');
        scene.fog = new THREE.FogExp2('#020205', 0.005);
      }}
    >
      <Suspense fallback={null}>
        <CameraController />
        
        <ambientLight intensity={0.1} />
        
        {/* Debug Stats */}
        {window.location.hash.includes('debug') && <Stats className="!absolute !top-0 !left-0 !z-50" />}
        
        {/* Core Universe Systems */}
        {loadStage >= 1 && (
          <>
            <ErrorBoundary fallback={null}>
              <HyperspaceSystem />
            </ErrorBoundary>
            <ErrorBoundary fallback={null}>
              <ParticleSystem count={settings.particleCount} />
            </ErrorBoundary>
          </>
        )}
        
        {loadStage >= 2 && (
          <ErrorBoundary fallback={null}>
            <NebulaSystem quality={quality} />
          </ErrorBoundary>
        )}
        
        {loadStage >= 3 && appState !== 'FINAL_BANG' && (
          <>
            <ErrorBoundary fallback={null}>
              <GalaxySystem />
            </ErrorBoundary>
            
            <ErrorBoundary fallback={null}>
              <AsteroidSystem count={settings.asteroidCount} />
            </ErrorBoundary>
            
            <ErrorBoundary fallback={null}>
              <MeteorSystem chance={settings.meteorChance} />
            </ErrorBoundary>
            
            <ErrorBoundary fallback={null}>
              <MemorySystem />
            </ErrorBoundary>
          </>
        )}
        
        {appState === 'FINAL_BANG' && (
          <ErrorBoundary fallback={null}>
            <FinaleSystem />
          </ErrorBoundary>
        )}
        
        {/* PostProcessing has been fully disabled to guarantee 100% stability
            and prevent the WebGL Bloom NaN cyan-screen crash on all devices. */}
      </Suspense>
    </SafeCanvas>
  );
}
