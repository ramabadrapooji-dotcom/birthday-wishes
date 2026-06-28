import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function LightingSystem({ isPlaying, analyserRef, isMobile = false }: { isPlaying: boolean, analyserRef: React.MutableRefObject<AnalyserNode | null>, isMobile?: boolean }) {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const hornSpotRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const hornTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  useFrame(() => {
    let bass = 0;
    if (analyserRef.current && isPlaying) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);
      const bassRange = data.slice(0, 5);
      bass = bassRange.reduce((a, b) => a + b, 0) / bassRange.length / 255;
    }

    if (spotLightRef.current) {
      spotLightRef.current.intensity = THREE.MathUtils.lerp(spotLightRef.current.intensity, isPlaying ? 8.0 + bass * 4.0 : 6.0, 0.1);
    }
    if (hornSpotRef.current) {
      hornSpotRef.current.intensity = THREE.MathUtils.lerp(hornSpotRef.current.intensity, isPlaying ? 4.0 + bass * 2.0 : 3.0, 0.1);
    }
  });

  const mainLampPos: [number, number, number] = isMobile ? [0, 5.5, 2.5] : [-1.5, 6.0, 2.5];
  const hornLightPos: [number, number, number] = isMobile ? [2, 3, 3] : [-1, 4, 3];

  React.useEffect(() => {
    if (spotLightRef.current) spotLightRef.current.target = targetRef.current;
    if (hornSpotRef.current) hornSpotRef.current.target = hornTargetRef.current;
  }, []);

  return (
    <>
      <primitive object={targetRef.current} position={isMobile ? [0, 0, -2] : [-3.0, 0, -2]} />
      <primitive object={hornTargetRef.current} position={isMobile ? [0, 1.5, -1] : [-2.0, 1.5, -1]} />

      <ambientLight intensity={0.15} color="#ffd4a3" />
      
      <spotLight
        ref={spotLightRef}
        position={mainLampPos}
        angle={0.7}
        penumbra={0.8}
        intensity={6.0}
        color="#ffebd6"
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={[2048, 2048]}
      />

      <spotLight
        ref={hornSpotRef}
        position={hornLightPos}
        angle={0.5}
        penumbra={1.0}
        intensity={3.0}
        color="#ffcc66"
        castShadow
      />
      
      <directionalLight 
        position={[-5, 4, -5]} 
        intensity={2.5} 
        color="#aaddff" 
      />
      
      <directionalLight 
        position={[3, 2, 1]} 
        intensity={1.0} 
        color="#ff9955" 
      />
    </>
  );
}
