import { useAppStore, QualityLevel } from '../../store/useAppStore';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SHADER_CHUNKS } from '../../utils/shaders';

// Generates a clustered particle nebula
function NebulaCluster({ position, color1, color2, scale, seed }: { position: [number, number, number], color1: string, color2: string, scale: number, seed: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 500;
  
  const [positions, colors, sizes, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const rnd = new Float32Array(count);
    
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    const c3 = new THREE.Color('#050510'); // dark dust
    
    // Simple pseudo-random
    let currentSeed = seed;
    const random = () => {
      const x = Math.sin(currentSeed++) * 10000;
      return x - Math.floor(x);
    };

    // Generate pillar-like structures using multiple overlapping paths
    let currentX = 0, currentY = 0, currentZ = 0;
    
    for (let i = 0; i < count; i++) {
      // Random walk with tendency to go UP (Y axis) for pillars
      currentX += (random() - 0.5) * 4;
      currentY += (random() - 0.2) * 6; 
      currentZ += (random() - 0.5) * 4;
      
      // Keep within bounds
      if (currentY > 100) currentY = -50;
      if (Math.abs(currentX) > 40) currentX *= 0.8;
      if (Math.abs(currentZ) > 40) currentZ *= 0.8;

      // Add noise to position
      const px = currentX + (random() - 0.5) * 15;
      const py = currentY + (random() - 0.5) * 15;
      const pz = currentZ + (random() - 0.5) * 15;

      pos[i * 3] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;

      // Color based on density/position and depth
      const mixRatio = random();
      const isDark = random() > 0.7; // 30% dark dust for depth
      
      const finalColor = isDark ? c3 : c1.clone().lerp(c2, mixRatio);
      
      // Make core more intense
      if (!isDark && random() > 0.9) {
          finalColor.lerp(new THREE.Color('#ffffff'), 0.5);
      }
      
      col[i * 3] = finalColor.r;
      col[i * 3 + 1] = finalColor.g;
      col[i * 3 + 2] = finalColor.b;

      siz[i] = 20.0 + random() * 60.0; // Even larger, softer particles
      rnd[i] = random();
    }
    
    return [pos, col, siz, rnd];
  }, [color1, color2, seed]);

  const uniforms = useMemo(() => ({
    time: { value: 0 }
  }), []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      uniforms.time.value += delta;
      pointsRef.current.rotation.y += delta * 0.02; // Slow majestic rotation
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
          <bufferAttribute attach="attributes-random" count={count} array={randoms} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
          uniforms={uniforms}
          vertexShader={`
            ${SHADER_CHUNKS.particleBaseVertex}
            
            void main() {
              vColor = color;
              
              // Slow undulating alpha
              vAlpha = 0.3 + 0.3 * sin(time * 0.5 + random * 10.0);
              
              // Very slow drift
              vec3 pos = position;
              pos.x += sin(time * 0.2 + random * 100.0) * 5.0;
              pos.y += cos(time * 0.15 + random * 100.0) * 5.0;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            varying vec3 vColor;
            varying float vAlpha;
            
            ${SHADER_CHUNKS.noise2D}
            ${SHADER_CHUNKS.volumetricFalloff}
            
            void main() {
              vec2 uv = gl_PointCoord;
              
              // Organic noise edges
              float n = hash(uv * 10.0) * 0.1;
              
              // Smooth volumetric falloff using shared chunk
              float alpha = getVolumetricAlpha(uv + vec2(n, n), 2.0) * vAlpha;
              if (alpha <= 0.0) discard;
              
              gl_FragColor = vec4(vColor, alpha * 0.35); // softer opacity for better volumetric blending
            }
          `}
        />
      </points>
    </group>
  );
}

export default function NebulaSystem({ quality }: { quality: QualityLevel }) {
  if (quality === 'LOW') return null; // Save performance on low end
  
  return (
    <group>
      {/* Orion-like blue/pink cluster */}
      <NebulaCluster position={[-400, 100, -600]} color1="#0055ff" color2="#ff00aa" scale={4} seed={42} />
      
      {/* Pillars-like golden/red cluster */}
      <NebulaCluster position={[500, -200, -800]} color1="#ffaa00" color2="#ff3300" scale={5} seed={1337} />
      
      {/* Deep purple background structure */}
      <NebulaCluster position={[0, 400, -1000]} color1="#aa00ff" color2="#0033aa" scale={6} seed={999} />
    </group>
  );
}
