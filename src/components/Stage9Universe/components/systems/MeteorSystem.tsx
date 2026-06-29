import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface Meteor {
  active: boolean;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  life: number;
}

export default function MeteorSystem({ chance = 0.05 }: { chance?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const poolSize = 20;
  const meteors = useMemo<Meteor[]>(() => 
    Array.from({ length: poolSize }, () => ({
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      scale: 1,
      life: 0
    }))
  , []);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempVector = useMemo(() => new THREE.Vector3(), []);

  const uniforms = useMemo(() => ({
    color1: { value: new THREE.Color('#ffffff') },
    color2: { value: new THREE.Color('#00ffff') },
  }), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Spawn logic
    if (Math.random() < chance * delta * 60) {
      const inactive = meteors.find(m => !m.active);
      if (inactive) {
        inactive.active = true;
        
        const startX = (Math.random() - 0.5) * 400;
        const startY = 200 + Math.random() * 100;
        const startZ = (Math.random() - 0.5) * 400;
        
        inactive.position.set(startX, startY, startZ);
        
        // Natural cinematic angles: mostly downward with gentle drift
        const lateralDrift = (Math.random() - 0.5) * 60;
        inactive.velocity.set(
          lateralDrift,
          -30 - Math.random() * 35, // slower, cinematic descent
          (Math.random() - 0.5) * 60
        );
        inactive.scale = 0.15 + Math.random() * 0.6;
        inactive.life = 1.0;
      }
    }

    meteors.forEach((m, i) => {
      if (!m.active) {
        dummy.position.set(0, 0, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        return;
      }

      m.position.addScaledVector(m.velocity, delta);
      m.life -= delta * 0.15; // Live much longer (slower fade)

      if (m.life <= 0 || m.position.y < -400) {
        m.active = false;
        dummy.scale.set(0, 0, 0);
      } else {
        dummy.position.copy(m.position);
        
        tempVector.copy(m.velocity).normalize();
        dummy.quaternion.setFromUnitVectors(
          dummy.up,
          tempVector
        );
        
        // Cinematic fade in and out using life
        // Life goes 1.0 -> 0.0
        // Parabola: 1.0 - (2x-1)^2 -> 0 at x=0, 1 at x=0.5, 0 at x=1
        const fade = 1.0 - Math.pow(2.0 * m.life - 1.0, 2.0);
        
        const speed = m.velocity.length();
        // The trail length changes as it burns up
        dummy.scale.set(m.scale * fade, speed * 0.3 * fade, m.scale * fade); 
      }
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, poolSize]}>
      {/* Shift the cone so its base is at the origin (head of meteor) and tip trails behind (upwards before rotation) */}
      <coneGeometry args={[0.5, 20, 8, 1, true]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform vec3 color1;
          uniform vec3 color2;
          void main() {
            // vUv.y goes from 0 (bottom/head) to 1 (top/tail)
            float headGlow = pow(1.0 - vUv.y, 4.0); // Intense at the head
            float tailFade = 1.0 - vUv.y;           // Linear fade for the tail
            
            vec3 color = mix(color2, color1, headGlow);
            float alpha = max(headGlow, tailFade * 0.5);
            
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </instancedMesh>
  );
}
