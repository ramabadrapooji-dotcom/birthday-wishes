import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { Text3D, Center, Sparkles } from '@react-three/drei';

// Heart confetti floating particles
function HeartConfetti({ quality }: { quality: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = quality === 'HIGH' ? 600 : quality === 'MEDIUM' ? 250 : 100;

  const [positions, velocities, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      vel[i * 3]     = (Math.random() - 0.5) * 0.5;
      vel[i * 3 + 1] = 0.3 + Math.random() * 0.8; // drift upward
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      rand[i]        = Math.random();
    }
    return [pos, vel, rand];
  }, [count]);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    opacity: { value: 0 },
  }), []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    uniforms.time.value += delta;
    // Slow fade-in — hearts drift in gradually like feelings surfacing (delta*0.4 from 0.8)
    uniforms.opacity.value = THREE.MathUtils.lerp(uniforms.opacity.value, 1.0, delta * 0.4);

    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      pos[i * 3]     += Math.sin(uniforms.time.value * 0.5 + randoms[i] * 10) * 0.01;
      pos[i * 3 + 2] += Math.cos(uniforms.time.value * 0.4 + randoms[i] * 10) * 0.01;
      // Wrap: recycle when drifted too high
      if (pos[i * 3 + 1] > 40) pos[i * 3 + 1] = -40;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-random" count={count} array={randoms} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          attribute float random;
          varying float vRandom;
          uniform float time;
          void main() {
            vRandom = random;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = (8.0 + random * 12.0) * (200.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vRandom;
          uniform float opacity;
          
          // Heart SDF
          float heart(vec2 p) {
            p.x = abs(p.x);
            p.y = -p.y + 0.3;
            float a = length(p - vec2(0.25, 0.0)) - 0.25;
            float b = length(p - vec2(0.0, -0.25)) - 0.35;
            return min(a, b);
          }
          
          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            uv *= 2.2; // scale to fit
            float h = heart(uv);
            if (h > 0.0) discard;
            
            // Color: rotate between rose gold, pink, gold
            vec3 c1 = vec3(1.0, 0.4, 0.6); // pink
            vec3 c2 = vec3(1.0, 0.8, 0.3); // gold
            vec3 color = mix(c1, c2, vRandom);
            
            float alpha = smoothstep(0.0, -0.1, h) * opacity;
            gl_FragColor = vec4(color, alpha * 0.9);
          }
        `}
      />
    </points>
  );
}

// Ambient gold dust particles after explosion
function GoldDust({ quality }: { quality: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = quality === 'HIGH' ? 1200 : quality === 'MEDIUM' ? 500 : 200;

  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;
      rand[i]        = Math.random();
    }
    return [pos, rand];
  }, [count]);

  const uniforms = useMemo(() => ({ time: { value: 0 }, opacity: { value: 0 } }), []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    uniforms.time.value += delta * 0.5;
    // Gold dust settles slowly after the explosion — extended ambient glow decay (delta*0.25 from 0.5)
    uniforms.opacity.value = THREE.MathUtils.lerp(uniforms.opacity.value, 1.0, delta * 0.25);
    const mat = pointsRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.time.value = uniforms.time.value;
    mat.uniforms.opacity.value = uniforms.opacity.value;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-random" count={count} array={randoms} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          attribute float random;
          uniform float time;
          varying float vRandom;
          void main() {
            vRandom = random;
            vec3 pos = position;
            // gentle drift
            pos.y += sin(time + random * 20.0) * 0.5;
            pos.x += cos(time * 0.7 + random * 15.0) * 0.3;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = (1.5 + random * 3.0) * (200.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vRandom;
          uniform float opacity;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = pow(smoothstep(0.5, 0.0, dist), 2.0) * opacity;
            vec3 gold = mix(vec3(1.0, 0.85, 0.4), vec3(1.0, 0.6, 0.2), vRandom);
            gl_FragColor = vec4(gold, alpha * 0.7);
          }
        `}
      />
    </points>
  );
}

export default function FinaleSystem() {
  const { finalePhase, quality } = useAppStore();
  const singularityRef = useRef<THREE.Mesh>(null);
  const textGroupRef = useRef<THREE.Group>(null);
  const messageGroupRef = useRef<THREE.Group>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);

  // Gravity onset: singularity doesn't begin growing until 1.5s into phase 1
  // This creates the "absolute stillness before collapse" — gravity thinking
  const collapseOnsetTimer = useRef(0);
  const COLLAPSE_ONSET_DELAY = 1.5;
  
  const particleCount = quality === 'HIGH' ? 5000 : quality === 'MEDIUM' ? 2000 : 800;
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    // Smooth explosion ramp: 0→1 over 1.5s so energy releases gradually, not as a spike
    explosionRamp: { value: 0 },
  }), []);

  const [expPos, expCol, expVel] = useMemo(() => {
    const count = particleCount;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 20 + Math.pow(Math.random(), 2) * 300;
      
      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed;
      
      const colors = [
        new THREE.Color('#ffffff'),
        new THREE.Color('#ffddaa'),
        new THREE.Color('#ff8800'),
        new THREE.Color('#ff0055'),
        new THREE.Color('#ffcc44'),
      ];
      const c = colors[Math.floor(Math.random() * colors.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col, vel];
  }, [particleCount]);

  useFrame((state, delta) => {
    uniforms.time.value += delta;

    // Phase 1: track onset timer for "gravity thinking" delay
    if (finalePhase === 1) {
      collapseOnsetTimer.current += delta;
    } else if (finalePhase === 0) {
      collapseOnsetTimer.current = 0;
    }

    if (singularityRef.current && finalePhase === 1) {
      if (collapseOnsetTimer.current < COLLAPSE_ONSET_DELAY) {
        // GRAVITY THINKING: absolute stillness — singularity stays invisible
        // This is the 1.5s "silence before the sinking begins"
        singularityRef.current.scale.set(0, 0, 0);
      } else {
        // After onset delay: slow gravitational growth (heavy damp = slow onset)
        const targetSize = 1.0;
        singularityRef.current.scale.lerpVectors(
          singularityRef.current.scale,
          { x: targetSize, y: targetSize, z: targetSize } as any,
          delta * 0.4 // very slow grow — feels like matter collapsing under gravity
        );
      }
    } else if (singularityRef.current && finalePhase === 2) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.1;
      singularityRef.current.scale.set(pulse, pulse, pulse);
    } else if (singularityRef.current && finalePhase === 3) {
      singularityRef.current.scale.lerpVectors(singularityRef.current.scale, {x:0,y:0,z:0} as any, delta * 15);
    }

    // Smooth explosion energy ramp: grows from 0 to 1 over 1.5s after phase 3 starts
    // This prevents the "instant spike" — energy builds as if gravity is releasing
    if (finalePhase === 3) {
      uniforms.explosionRamp.value = Math.min(1.0, uniforms.explosionRamp.value + delta / 1.5);
    } else {
      uniforms.explosionRamp.value = 0;
    }

    if (shockwaveRef.current && finalePhase === 3) {
      // Slowed from 150 to 80 for same smooth energy-release feel as explosion
      shockwaveRef.current.scale.addScalar(delta * 80);
      const material = shockwaveRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.opacity.value = Math.max(0, material.uniforms.opacity.value - delta * 0.8);
      }
    }

    // Main title rises in — slowed to 0.8 (from 1.5) so it feels like "arrival", not animation
    if (textGroupRef.current && finalePhase === 3) {
      textGroupRef.current.scale.lerpVectors(textGroupRef.current.scale, {x:1,y:1,z:1} as any, delta * 0.8);
      textGroupRef.current.position.y = THREE.MathUtils.lerp(
        textGroupRef.current.position.y, 
        4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3,
        delta * 1.2
      );
    }
    
    // Emotional message fades in — now after 4.0s (from 2.5s) for breathing room after title
    if (messageGroupRef.current && finalePhase === 3) {
      const t = Math.max(0, uniforms.time.value - 4.0); // extended silence before message surfaces
      const visibility = Math.min(1, t / 2.0); // also slower reveal (2.0s from 1.5s)
      messageGroupRef.current.scale.lerpVectors(
        messageGroupRef.current.scale,
        { x: visibility, y: visibility, z: visibility } as any,
        delta * 0.8 // slow lerp so message truly "arrives" gently
      );
      messageGroupRef.current.position.y = THREE.MathUtils.lerp(
        messageGroupRef.current.position.y,
        -4 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2,
        delta * 0.8
      );
    }
  });

  return (
    <group>
      {/* Phase 1 & 2: Singularity point */}
      {(finalePhase === 1 || finalePhase === 2) && (
        <mesh ref={singularityRef} scale={[0, 0, 0]}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
          {/* Intense glow layers */}
          <mesh scale={[3, 3, 3]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial color="#ffffcc" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh scale={[8, 8, 8]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </mesh>
      )}

      {/* Phase 3: Full Explosion + Emotional Scene */}
      {finalePhase === 3 && (
        <group>
          {/* Shockwave Ring */}
          <mesh ref={shockwaveRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 1, 128]} />
            <shaderMaterial
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              uniforms={{
                color: { value: new THREE.Color('#ffaa00') },
                opacity: { value: 1.0 }
              }}
              vertexShader={`
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `}
              fragmentShader={`
                varying vec2 vUv;
                uniform vec3 color;
                uniform float opacity;
                void main() {
                  float dist = abs(vUv.y - 0.5) * 2.0;
                  float alpha = (1.0 - dist) * opacity;
                  gl_FragColor = vec4(color, alpha);
                }
              `}
            />
          </mesh>
          
          {/* Expansion flash sphere */}
          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              uniforms={{ time: uniforms.time, color: { value: new THREE.Color('#ffffff') } }}
              vertexShader={`
                varying vec2 vUv;
                uniform float time;
                void main() {
                  vUv = uv;
                  vec3 pos = position;
                  pos *= (1.0 + time * 100.0);
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
              `}
              fragmentShader={`
                varying vec2 vUv;
                uniform float time;
                uniform vec3 color;
                void main() {
                  float alpha = max(0.0, 1.0 - time * 2.0);
                  gl_FragColor = vec4(color, alpha * 0.5);
                }
              `}
            />
          </mesh>

          {/* HAPPY BIRTHDAY 3D Text */}
          <group ref={textGroupRef} scale={[0, 0, 0]} position={[0, 0, 0]}>
            <Center>
              <Text3D
                font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json"
                size={2.2}
                height={0.4}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.08}
                bevelSize={0.04}
                bevelSegments={5}
              >
                HAPPY BIRTHDAY
                <meshPhysicalMaterial
                  color="#ffffff"
                  emissive="#ffcc44"
                  emissiveIntensity={3.5}
                  metalness={1.0}
                  roughness={0.05}
                  clearcoat={1.0}
                  transmission={0.15}
                />
              </Text3D>
            </Center>
            {/* Warm golden light behind text */}
            <pointLight position={[0, 0, -3]} intensity={8} color="#ffaa22" distance={40} />
          </group>

          {/* Emotional cinematic message (fades in ~2.5s after text) */}
          <group ref={messageGroupRef} scale={[0, 0, 0]} position={[0, -4, 0]}>
            <Center>
              <Text3D
                font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json"
                size={0.65}
                height={0.08}
                curveSegments={8}
                bevelEnabled={false}
              >
                Every memory a star in your universe
                <meshPhysicalMaterial
                  color="#ffffff"
                  emissive="#ffcc88"
                  emissiveIntensity={2.0}
                  metalness={0.5}
                  roughness={0.2}
                />
              </Text3D>
            </Center>
          </group>

          {/* Explosion Particles */}
          <points>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" count={particleCount} array={expPos} itemSize={3} />
              <bufferAttribute attach="attributes-color" count={particleCount} array={expCol} itemSize={3} />
              <bufferAttribute attach="attributes-velocity" count={particleCount} array={expVel} itemSize={3} />
            </bufferGeometry>
            <shaderMaterial
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              vertexColors
              uniforms={{ time: uniforms.time, explosionRamp: uniforms.explosionRamp }}
              vertexShader={`
                attribute vec3 velocity;
                varying vec3 vColor;
                uniform float time;
                uniform float explosionRamp; // 0→1 over 1.5s — smooth energy release
                void main() {
                  vColor = color;
                  // Apply smooth ramp so particles accelerate from stillness, not instant spike
                  vec3 pos = position + velocity * time * explosionRamp;
                  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                  gl_PointSize = (150.0 / -mvPosition.z) * max(0.0, 1.0 - time * 0.1);
                  gl_Position = projectionMatrix * mvPosition;
                }
              `}
              fragmentShader={`
                varying vec3 vColor;
                void main() {
                  float dist = length(gl_PointCoord - vec2(0.5));
                  if (dist > 0.5) discard;
                  float alpha = pow(smoothstep(0.5, 0.0, dist), 2.0);
                  gl_FragColor = vec4(vColor, alpha);
                }
              `}
            />
          </points>

          {/* Heart confetti floating up */}
          <HeartConfetti quality={quality} />

          {/* Ambient gold dust */}
          <GoldDust quality={quality} />

          {/* Sparkle systems */}
          <Sparkles count={quality === 'HIGH' ? 800 : 250} scale={50} size={8} speed={0.6} opacity={0.9} color="#ffffff" />
          <Sparkles count={quality === 'HIGH' ? 600 : 200} scale={60} size={4} speed={0.7} opacity={0.9} color="#ffaa00" />
          <Sparkles count={quality === 'HIGH' ? 300 : 100} scale={40} size={12} speed={1.0} opacity={1.0} color="#ff7799" />
        </group>
      )}
    </group>
  );
}
