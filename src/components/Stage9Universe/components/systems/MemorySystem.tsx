import { useFrame, useLoader } from '@react-three/fiber';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useAppStore, MemoryData } from '../../store/useAppStore';
import { memoriesData } from '../../data/memories';
import { Text, useTexture } from '@react-three/drei';

function MemoryParticles({ hovered }: { hovered: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, sizes] = useMemo(() => {
    const count = 40;
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 2.5 + Math.random() * 1.5;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = Math.sin(theta) * r + 0.2; // slightly in front
      siz[i] = Math.random() * 0.15;
    }
    return [pos, siz];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * (hovered ? 0.5 : 0.1);
      pointsRef.current.rotation.z += delta * (hovered ? 0.2 : 0.05);
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value += delta;
      material.uniforms.opacity.value = THREE.MathUtils.lerp(
        material.uniforms.opacity.value,
        hovered ? 1.0 : 0.2,
        delta * 2
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={40} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={40} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          time: { value: 0 },
          color: { value: new THREE.Color('#ffcc77') }, // warm gold
          opacity: { value: 0.2 }
        }}
        vertexShader={`
          attribute float size;
          varying float vAlpha;
          uniform float time;
          void main() {
            vec3 pos = position;
            pos.y += sin(time + position.x * 2.0) * 0.2;
            vAlpha = 0.5 + 0.5 * sin(time * 3.0 + position.z * 10.0);
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float opacity;
          varying float vAlpha;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.1, dist) * vAlpha * opacity;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </points>
  );
}

function MemoryPhoto({ memory, index }: { memory: MemoryData, index: number }) {
  const { setSelectedMemory, transitionState, appState, selectedMemory } = useAppStore();
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [focusTime, setFocusTime] = useState(0);

  // Emotional release: linger at focus position for 0.45s before sliding back
  const releaseTimer = useRef(0);
  const RELEASE_LINGER = 0.45;
  
  // Ref for the glass frame material to adjust emissive lighting during transitions
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  // Load texture
  const texture = useLoader(THREE.TextureLoader, memory.imageUrl);
  useMemo(() => {
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  // Object-fit: cover logic
  const planeAspect = 4 / 3;
  const imageAspect = texture.image ? texture.image.width / texture.image.height : 1;
  
  const uvScale = useMemo(() => {
    if (imageAspect > planeAspect) {
      // Image is wider than plane
      return new THREE.Vector2(planeAspect / imageAspect, 1);
    } else {
      // Image is taller than plane
      return new THREE.Vector2(1, imageAspect / planeAspect);
    }
  }, [imageAspect, planeAspect]);
  
  const uvOffset = useMemo(() => {
    // For portrait/tall photos, perfectly align to the top center (1.0) so heads aren't cut off.
    // In THREE WebGL coordinates, V=1 is the top. So offset = 1 - scale.y (align top).
    const yOffset = imageAspect < planeAspect ? (1 - uvScale.y) * 1.0 : (1 - uvScale.y) / 2;
    return new THREE.Vector2((1 - uvScale.x) / 2, yOffset);
  }, [uvScale, imageAspect, planeAspect]);

  const isSelected = selectedMemory?.id === memory.id;
  const isHidden = appState === 'MEMORY_FOCUS' && !isSelected;
  
  // Bobbing animation
  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  const photoGroupRef = useRef<THREE.Group>(null);
  const panelGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    if (appState === 'EXPLORE') {
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime + randomOffset) * delta * 0.5;
      
      // Look at center (camera orbit origin)
      groupRef.current.lookAt(0, 0, 0);
      
      // Micro breathing scale — 0.5% sinusoidal pulse gives the frames a "living" presence
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8 + randomOffset) * 0.005;
      const targetScale = (hovered ? 1.05 : 1) * breathe;
      groupRef.current.scale.lerpVectors(groupRef.current.scale, { x: targetScale, y: targetScale, z: targetScale } as any, delta * 4);
    }
    
    if (photoGroupRef.current && panelGroupRef.current) {
      if (isSelected && appState === 'MEMORY_FOCUS') {
        releaseTimer.current = 0; // reset release timer while focused
        setFocusTime((prev) => prev + delta);
        
        // Pre-focus hesitation: camera "thinks" for 0.55s before slide begins
        if (focusTime < 0.55) return;
        
        // Emotional transition timing: smooth slide (starts after hesitation window)
        photoGroupRef.current.position.lerp(new THREE.Vector3(2.5, 0, 0), delta * 2);
        panelGroupRef.current.position.lerp(new THREE.Vector3(-2.5, 0, 0), delta * 2);
        
        // Slow fade-in for the story panel — floats in gently after slight delay
        const targetScale = focusTime > 1.1 ? 1 : 0.001;
        panelGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 1.5);
        
        if (materialRef.current) {
          materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, 0.4, delta * 2);
        }
      } else {
        setFocusTime(0);
        releaseTimer.current += delta;

        // EMOTIONAL RELEASE LINGER: hold position for RELEASE_LINGER seconds before resetting
        // This gives the camera time to emotionally "let go" before the frame slides away
        if (releaseTimer.current < RELEASE_LINGER) return;

        // Slightly slower reset so the return also feels graceful (delta*3 from 4)
        photoGroupRef.current.position.lerp(new THREE.Vector3(0, 0, 0), delta * 3);
        panelGroupRef.current.position.lerp(new THREE.Vector3(0, 0, 0), delta * 3);
        panelGroupRef.current.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), delta * 3);
        if (materialRef.current) {
            materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, 0, delta * 2);
        }
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (appState !== 'EXPLORE') return;
    setSelectedMemory(memory);
    transitionState('MEMORY_FOCUS');
    setHovered(false);
  };

  return (
    <group 
      ref={groupRef} 
      position={memory.position} 
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      visible={!isHidden}
    >
      <group ref={photoGroupRef}>
        {/* Premium Glass Frame */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[4.2, 3.2, 0.05]} />
          <meshPhysicalMaterial 
            ref={materialRef}
            color="#ffffff"
            metalness={0.1}
            roughness={0.05}
            transmission={1.0}
            thickness={0.5}
            ior={1.5}
            emissive={hovered ? "#332211" : "#000000"}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* Photo Plane */}
        <mesh>
          <planeGeometry args={[4, 3]} />
          <shaderMaterial
            uniforms={{
              map: { value: texture },
              uvScale: { value: uvScale },
              uvOffset: { value: uvOffset }
            }}
            vertexShader={`
              varying vec2 vUv;
              uniform vec2 uvScale;
              uniform vec2 uvOffset;
              void main() {
                vUv = uv * uvScale + uvOffset;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              varying vec2 vUv;
              uniform sampler2D map;
              void main() {
                vec4 texColor = texture2D(map, vUv);
                // Sharpen slightly or boost contrast for cinematic feel
                texColor.rgb = pow(texColor.rgb, vec3(0.9)); 
                gl_FragColor = vec4(texColor.rgb, 1.0);
              }
            `}
          />
        </mesh>
        
        {/* Cinematic Glow Behind */}
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[4.5, 3.5]} />
          <meshBasicMaterial 
            color="#ffaa44" 
            transparent 
            opacity={hovered ? 0.2 : 0.02} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      <group ref={panelGroupRef} scale={[0.001, 0.001, 0.001]}>
        {/* Glass Holographic Story Panel */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[4.2, 3.2, 0.02]} />
          <meshPhysicalMaterial 
            color="#ffffff"
            metalness={0.2}
            roughness={0.3}
            transmission={0.9}
            ior={1.2}
            emissive="#110022"
          />
        </mesh>
        
        {/* Elegant Story Text */}
        <Text
          position={[0, 0, 0]}
          color="#ffeecc"
          fontSize={0.2}
          maxWidth={3.6}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          lineHeight={1.5}
        >
          {memory.story}
        </Text>
      </group>

      <MemoryParticles hovered={hovered} />
    </group>
  );
}

export default function MemorySystem() {
  return (
    <group>
      {memoriesData.map((mem, i) => {
        // Dynamic Orbital Layout for any number of memories
        const radius = 18;
        const total = memoriesData.length;
        const angle = (i / total) * Math.PI * 2;
        // Introduce some slight vertical staggering
        const yOffset = Math.sin(angle * 3) * 6;
        
        const dynamicPosition: [number, number, number] = [
          Math.cos(angle) * radius,
          yOffset,
          Math.sin(angle) * radius
        ];

        const memoryWithDynamicPos = { ...mem, position: dynamicPosition };
        
        return <MemoryPhoto key={mem.id} memory={memoryWithDynamicPos} index={i} />;
      })}
    </group>
  );
}

memoriesData.forEach((mem) => {
  useTexture.preload(mem.imageUrl);
});
