import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function GalaxySystem() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, colors, sizes, rotations] = useMemo(() => {
    const count = 300; // Many tiny galaxies
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const rot = new Float32Array(count);
    
    const colorTypes = [
      new THREE.Color('#ffaa00'),
      new THREE.Color('#0055ff'),
      new THREE.Color('#ff00aa'),
      new THREE.Color('#00aaff'),
      new THREE.Color('#ffffff')
    ];

    for (let i = 0; i < count; i++) {
      // Distribute extremely far away spherically
      const radius = 2500 + Math.random() * 2500;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const c = colorTypes[Math.floor(Math.random() * colorTypes.length)];
      
      // Steeper brightness curve: ~80% are near-invisible, ~20% are bright cinematic landmarks
      const rand = Math.random();
      const brightness = rand > 0.80
        ? 0.8 + rand * 1.5          // Cinematic bright galaxy
        : Math.pow(rand, 6) * 0.3;  // Background noise, nearly invisible
      
      col[i * 3] = c.r * brightness;
      col[i * 3 + 1] = c.g * brightness;
      col[i * 3 + 2] = c.b * brightness;

      siz[i] = (30 + Math.random() * 300) * (brightness > 0.8 ? 4 : 0.8); // Cinematic ones are massive
      rot[i] = Math.random() * Math.PI * 2;
    }
    
    return [pos, col, siz, rot];
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={300} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={300} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={300} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-rotation" count={300} array={rotations} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        vertexShader={`
          attribute float size;
          attribute float rotation;
          varying vec3 vColor;
          varying float vRotation;
          void main() {
            vColor = color;
            vRotation = rotation;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vRotation;
          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            
            float s = sin(vRotation);
            float c = cos(vRotation);
            mat2 rot = mat2(c, -s, s, c);
            uv = rot * uv;
            
            float dist = length(uv);
            if (dist > 0.5) discard;
            
            float angle = atan(uv.y, uv.x);
            // More organic spiral arms
            float spiral = sin(angle * 2.0 + dist * 12.0) * 0.5 + 0.5;
            float spiral2 = sin(angle * 3.0 + dist * 6.0) * 0.5 + 0.5;
            
            // Soft galactic disc, fading quickly at edges
            float disc = pow(smoothstep(0.5, 0.0, dist), 1.5);
            // Very bright Core
            float core = pow(smoothstep(0.15, 0.0, dist), 3.0) * 3.0;
            
            float alpha = disc * (0.1 + 0.6 * spiral * spiral2) + core;
            
            // Darker dust lanes in the spiral
            float dust = smoothstep(0.1, 0.4, dist) * (1.0 - spiral);
            alpha *= (1.0 - dust * 0.5);
            
            gl_FragColor = vec4(vColor, alpha * 0.85);
          }
        `}
      />
    </points>
  );
}
