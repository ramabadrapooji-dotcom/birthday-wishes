import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export default function ParticleSystem({ count = 5000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { appState, finalePhase } = useAppStore();
  
  const [positions, colors, sizes, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const rnd = new Float32Array(count);
    
    const colorTheme = [
      new THREE.Color('#4d79ff'), // Blue
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#ffb3ff'), // Pink
      new THREE.Color('#cc99ff'), // Purple
      new THREE.Color('#ffd1b3'), // Gold/Orange
    ];

    for (let i = 0; i < count; i++) {
      // Create depth layers
      const type = Math.random();
      let r, minSize, maxSize;
      let isDust = false;
      
      if (type < 0.15) {
        // Layer 1: Foreground sharp stars & dust
        r = 10 + Math.random() * 100;
        minSize = 0.2; maxSize = 1.0;
        isDust = Math.random() > 0.5;
        if (isDust) { minSize = 1.5; maxSize = 3.5; }
      } else if (type < 0.5) {
        // Layer 2: Middle dust / small elements
        r = 100 + Math.random() * 600;
        minSize = 0.5; maxSize = 2.0;
      } else {
        // Layer 3: Far distant stars
        r = 600 + Math.random() * 2000;
        minSize = 1.0; maxSize = 4.0;
      }

      // Spherical distribution, but slightly squashed on Y to feel like a galactic plane
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2 - 1) * (type < 0.5 ? 0.2 : 0.6)); 

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.4; // Squash Y
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Color variation based on layer
      const c = colorTheme[Math.floor(Math.random() * colorTheme.length)].clone();
      if (isDust) {
        c.lerp(new THREE.Color('#334466'), 0.8); // Darker blueish dust
      } else if (type >= 0.5) { // Far layer is slightly more orange/red shifted
        c.lerp(new THREE.Color('#ffaa00'), Math.random() * 0.4);
      }
      
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      siz[i] = minSize + Math.random() * (maxSize - minSize);
      rnd[i] = Math.random(); // For twinkle phase
    }
    
    return [pos, col, siz, rnd];
  }, [count]);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    finaleCollapse: { value: 0 },
    explosion: { value: 0 },
  }), []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      uniforms.time.value += delta;

      if (appState === 'FINAL_BANG') {
        if (finalePhase === 1 || finalePhase === 2) {
          uniforms.finaleCollapse.value = THREE.MathUtils.lerp(uniforms.finaleCollapse.value, 1, delta * 1.5);
        } else if (finalePhase === 3) {
          uniforms.explosion.value += delta * 2.0; // expand outwards
        }
      }
    }
  });

  return (
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
          attribute float size;
          attribute float random;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float time;
          uniform float finaleCollapse;
          uniform float explosion;
          
          void main() {
            vColor = color;
            
            // Twinkle effect (dust doesn't twinkle as much, stars do)
            float isDust = (size > 2.0 && size < 4.0) ? 0.1 : 1.0;
            vAlpha = (0.5 + 0.5 * sin(time * 1.5 + random * 100.0)) * isDust;
            if (isDust < 0.5) vAlpha = 0.15; // fixed low opacity for dust
            
            vec3 pos = position;

            // Subtle parallax movement based on time and position
            float parallaxScale = 1.0 / max(1.0, length(pos) * 0.01);
            pos.x += sin(time * 0.1 + pos.z * 0.01) * 2.0 * parallaxScale;
            pos.y += cos(time * 0.1 + pos.x * 0.01) * 2.0 * parallaxScale;
            
            if (explosion > 0.0) {
              // Explode outwards rapidly
              pos = mix(vec3(0.0), pos * (1.0 + random * 5.0), min(explosion, 1.0));
              pos += normalize(pos) * explosion * 100.0 * random;
              vAlpha *= max(1.0 - (explosion * 0.2), 0.0);
            } else if (finaleCollapse > 0.0) {
              // Collapse to center
              pos = mix(pos, vec3(0.0), finaleCollapse * (1.0 - random * 0.1));
            }
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            // Circle shape
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            // Soft edge
            float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
      />
    </points>
  );
}
