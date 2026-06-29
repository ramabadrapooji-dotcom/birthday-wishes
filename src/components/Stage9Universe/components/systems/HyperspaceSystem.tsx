import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export default function HyperspaceSystem() {
  const { appState } = useAppStore();
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const [positions, colors, tailFlags] = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 2 * 3);
    const col = new Float32Array(count * 2 * 3);
    const flags = new Float32Array(count * 2);
    
    for (let i = 0; i < count; i++) {
      // Distribute in a cylinder along Z
      const radius = 20 + Math.random() * 400;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 2000;
      
      const length = 20 + Math.random() * 80;
      
      // Head
      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;
      flags[i * 2] = 0.0; // Is not tail
      
      // Tail
      pos[i * 6 + 3] = x;
      pos[i * 6 + 4] = y;
      pos[i * 6 + 5] = z + length; 
      flags[i * 2 + 1] = 1.0; // Is tail
      
      // Color (White, Soft Blue, Gold only)
      const type = Math.random();
      let r, g, b;
      if (type < 0.33) {
          // Gold
          r = 1.0; g = 0.85; b = 0.5;
      } else if (type < 0.66) {
          // Soft Blue
          r = 0.7; g = 0.85; b = 1.0;
      } else {
          // Pure White
          r = 1.0; g = 1.0; b = 1.0;
      }
      
      col[i * 6] = r; col[i * 6 + 1] = g; col[i * 6 + 2] = b;
      col[i * 6 + 3] = r; col[i * 6 + 4] = g; col[i * 6 + 5] = b;
    }
    
    return [pos, col, flags];
  }, []);

  const uniforms = useMemo(() => ({
    progress: { value: 0 },
    speed: { value: 0 }
  }), []);

  const hyperspaceTime = useRef(0);
  // Post-warp settle: tracks how long we've been in the exhale phase after warp
  const settleTime = useRef(0);
  const SETTLE_DURATION = 0.6; // seconds of ultra-slow decay (visual exhale)

  useFrame((state, delta) => {
    if (appState === 'WARP') {
      hyperspaceTime.current += delta;
      settleTime.current = 0; // reset settle while actively warping
      
      // Micro anticipation hold: 0–0.45s stars remain still, universe "breathes" before the pull
      const ANTICIPATION = 0.45;
      const activeTime = Math.max(0, hyperspaceTime.current - ANTICIPATION);
      
      // Power-based natural acceleration curve (easeInCubic feel) over 6s active time
      const rawT = Math.min(activeTime / 6.0, 1.0);
      const easedT = rawT * rawT * rawT; // cubic ease-in
      
      if (activeTime <= 0) {
        // Anticipation window: hold perfectly still — let the silence land
        uniforms.progress.value = THREE.MathUtils.lerp(uniforms.progress.value, 0.0, delta * 6.0);
      } else if (activeTime < 2.0) {
        // 0–2s active: gentle pull — stars begin to drift
        uniforms.progress.value = THREE.MathUtils.lerp(uniforms.progress.value, easedT * 0.25, delta * 3.0);
      } else if (activeTime < 4.0) {
        // 2–4s active: stretch — stars elongate toward camera
        uniforms.progress.value = THREE.MathUtils.lerp(uniforms.progress.value, easedT * 0.65, delta * 2.0);
      } else {
        // 4s+ active: full cinematic speed
        uniforms.progress.value = THREE.MathUtils.lerp(uniforms.progress.value, 1.0, delta * 1.2);
      }
      uniforms.speed.value = Math.pow(uniforms.progress.value, 2.0) * 8000.0; // exponential speed growth
    } else {
      hyperspaceTime.current = 0;
      settleTime.current += delta;

      if (settleTime.current < SETTLE_DURATION) {
        // POST-WARP EXHALE: ultra-slow decay — stars linger briefly, universe breathes out
        // This creates the "memory of speed" before the tunnel fully dissolves
        uniforms.progress.value = THREE.MathUtils.lerp(uniforms.progress.value, 0, delta * 0.25);
      } else {
        // Normal cinematic slowdown — exponential decay
        uniforms.progress.value = THREE.MathUtils.lerp(uniforms.progress.value, 0, delta * 0.6);
      }
      uniforms.speed.value = Math.pow(uniforms.progress.value, 2.0) * 8000.0;
    }
    
    if (linesRef.current) {
      if (uniforms.progress.value > 0.01) {
        linesRef.current.visible = true;
        const mat = linesRef.current.material as THREE.ShaderMaterial;
        mat.uniforms.progress.value = uniforms.progress.value;
        mat.uniforms.speed.value = uniforms.speed.value;
      } else {
        linesRef.current.visible = false;
      }
    }
  });

  return (
    <lineSegments ref={linesRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={3000 * 2} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={3000 * 2} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-isTail" count={3000 * 2} array={tailFlags} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          attribute float isTail;
          #ifndef USE_COLOR
          attribute vec3 color;
          #endif
          uniform float progress;
          uniform float speed;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            #ifndef USE_COLOR
            vColor = color;
            #else
            vColor = color; // Three.js defines color if vertexColors is true
            #endif
            vec3 pos = position;
            
            // Move entire field forward towards camera
            pos.z += speed * 5.0;
            
            // Natural star stretch based on distance from center (outer stars stretch more)
            float distFromCenter = length(pos.xy);
            float stretchFactor = 1.0 + distFromCenter * 0.0008;
            if (isTail > 0.5) {
                pos.z += speed * 2.0 * stretchFactor; // variable stretch per star
            }
            
            // Wrap around
            float wrap = 2000.0;
            pos.z = mod(pos.z + wrap/2.0, wrap) - wrap/2.0;
            
            // Head bright, tail fades gracefully
            if (isTail > 0.5) {
                vAlpha = 0.0; // tail transparent
            } else {
                vAlpha = progress; // head bright
            }
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            gl_FragColor = vec4(vColor, vAlpha);
          }
        `}
      />
    </lineSegments>
  );
}
