import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Sparkles, Text3D, Center } from '@react-three/drei';

// ─── Cake Layer ───────────────────────────────────────────────────────────────
function CakeLayer({
  radius,
  height,
  position,
  color,
}: {
  radius: number;
  height: number;
  position: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 64]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

// ─── Frosting Waves ───────────────────────────────────────────────────────────
function FrostingWaves({
  radius,
  yPos,
  color,
  scaleY = 1,
}: {
  radius: number;
  yPos: number;
  color: string;
  scaleY?: number;
}) {
  return (
    <mesh
      position={[0, yPos, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[1, 1, scaleY]}
      castShadow
      receiveShadow
    >
      <torusGeometry args={[radius, 0.12, 32, 100]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  );
}

// ─── Cake Drips ───────────────────────────────────────────────────────────────
function CakeDrips({
  radius,
  count,
  yPos,
  color,
  minLength,
  maxLength,
}: {
  radius: number;
  count: number;
  yPos: number;
  color: string;
  minLength: number;
  maxLength: number;
}) {
  const drips = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.1;
      const length = minLength + Math.random() * (maxLength - minLength);
      const r = radius + 0.005;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      temp.push({
        position: [x, yPos - length / 2, z] as [number, number, number],
        length,
        rotationY: -angle + Math.PI / 2,
      });
    }
    return temp;
  }, [radius, count, yPos, minLength, maxLength]);

  return (
    <group>
      {drips.map((d, i) => (
        <mesh
          key={i}
          position={d.position}
          rotation={[0, d.rotationY, 0]}
          castShadow
        >
          <capsuleGeometry args={[0.03 + Math.random() * 0.02, d.length, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
        </mesh>
      ))}
      <mesh position={[0, yPos + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[radius, 0.06, 16, 64]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
}

// ─── Pearl Ring ───────────────────────────────────────────────────────────────
function PearlRing({
  radius,
  count,
  yPos,
}: {
  radius: number;
  count: number;
  yPos: number;
}) {
  const pearls = useMemo(() => {
    const temp: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      temp.push([Math.cos(angle) * radius, yPos, Math.sin(angle) * radius]);
    }
    return temp;
  }, [radius, count, yPos]);

  return (
    <group>
      {pearls.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#EAE0C8" roughness={0.2} metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Frosting Stars ───────────────────────────────────────────────────────────
function FrostingStars({
  radius,
  count,
  yPos,
  color = '#F7E7CE',
}: {
  radius: number;
  count: number;
  yPos: number;
  color?: string;
}) {
  const stars = useMemo(() => {
    const temp: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      temp.push([Math.cos(angle) * radius, yPos, Math.sin(angle) * radius]);
    }
    return temp;
  }, [radius, count, yPos]);

  return (
    <group>
      {stars.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Cake Sprinkles ───────────────────────────────────────────────────────────
function CakeSprinkles({
  radius,
  count,
  yPos,
  height,
  sidesOnly = false,
}: {
  radius: number;
  count: number;
  yPos: number;
  height?: number;
  sidesOnly?: boolean;
}) {
  const sprinkles = useMemo(() => {
    const temp: { position: [number, number, number]; rotation: [number, number, number]; color: string }[] = [];
    const colors = ['#FFFFFF', '#FFC0CB', '#FF69B4', '#FFD700', '#FF1493'];
    for (let i = 0; i < count; i++) {
      const isSide = sidesOnly || (height && !sidesOnly ? Math.random() > 0.3 : false);
      let position: [number, number, number];
      let rotationVec: [number, number, number];

      if (isSide) {
        const theta = Math.random() * 2 * Math.PI;
        const outRadius = radius + 0.015;
        const x = outRadius * Math.cos(theta);
        const z = outRadius * Math.sin(theta);
        const y = yPos - (height || 0) + 0.05 + Math.random() * ((height || 0) - 0.1);
        position = [x, y, z];
        const euler = new THREE.Euler(0, -theta + Math.PI / 2, Math.random() * Math.PI, 'YXZ');
        rotationVec = [euler.x, euler.y, euler.z];
      } else {
        const r = Math.sqrt(Math.random()) * (radius - 0.15);
        const theta = Math.random() * 2 * Math.PI;
        position = [r * Math.cos(theta), yPos + 0.01, r * Math.sin(theta)];
        const euler = new THREE.Euler(Math.PI / 2, 0, Math.random() * Math.PI * 2, 'XYZ');
        rotationVec = [euler.x, euler.y, euler.z];
      }

      temp.push({ position, rotation: rotationVec, color: colors[Math.floor(Math.random() * colors.length)] });
    }
    return temp;
  }, [radius, count, yPos, height, sidesOnly]);

  return (
    <group>
      {sprinkles.map((s, i) => (
        <mesh key={i} position={s.position} rotation={s.rotation} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.08, 5]} />
          <meshStandardMaterial color={s.color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Star Sprinkles ───────────────────────────────────────────────────────────
function StarSprinkles({
  radius,
  count,
  yPos,
  height,
  sidesOnly = false,
}: {
  radius: number;
  count: number;
  yPos: number;
  height?: number;
  sidesOnly?: boolean;
}) {
  const { shape, extrudeSettings } = useMemo(() => {
    const s = new THREE.Shape();
    const outR = 0.035;
    const inR = 0.015;
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outR : inR;
      const a = (Math.PI * 2 * i) / 10;
      if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    return { shape: s, extrudeSettings: { depth: 0.008, bevelEnabled: false } };
  }, []);

  const sprinkles = useMemo(() => {
    const temp: { position: [number, number, number]; rotation: [number, number, number]; color: string }[] = [];
    const colors = ['#FFD700', '#FFDA75', '#FFC0CB', '#FFFFFF', '#FF69B4'];
    for (let i = 0; i < count; i++) {
      const isSide = sidesOnly || (height && !sidesOnly ? Math.random() > 0.3 : false);
      let position: [number, number, number];
      let rotationVec: [number, number, number];

      if (isSide) {
        const theta = Math.random() * 2 * Math.PI;
        const outRadius = radius + 0.01;
        const x = outRadius * Math.cos(theta);
        const z = outRadius * Math.sin(theta);
        const y = yPos - (height || 0) + 0.05 + Math.random() * ((height || 0) - 0.1);
        position = [x, y, z];
        const euler = new THREE.Euler(0, -theta + Math.PI / 2, Math.random() * Math.PI * 2, 'YXZ');
        rotationVec = [euler.x, euler.y, euler.z];
      } else {
        const r = Math.sqrt(Math.random()) * (radius - 0.15);
        const theta = Math.random() * 2 * Math.PI;
        position = [r * Math.cos(theta), yPos + 0.01, r * Math.sin(theta)];
        const euler = new THREE.Euler(-Math.PI / 2, 0, Math.random() * Math.PI * 2, 'XYZ');
        rotationVec = [euler.x, euler.y, euler.z];
      }

      temp.push({ position, rotation: rotationVec, color: colors[Math.floor(Math.random() * colors.length)] });
    }
    return temp;
  }, [radius, count, yPos, height, sidesOnly]);

  return (
    <group>
      {sprinkles.map((s, i) => (
        <mesh key={i} position={s.position} rotation={s.rotation} castShadow>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial color={s.color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Cake Topper ─────────────────────────────────────────────────────────────
function CakeTopper({ name = 'pooji' }: { name?: string }) {
  const heartShape = useMemo(() => {
    const x = 0, y = 0;
    const shape = new THREE.Shape();
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 5.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    return shape;
  }, []);

  const goldMaterial = (
    <meshPhysicalMaterial
      color="#FFDF00"
      metalness={1.0}
      roughness={0.15}
      emissive="#443300"
      emissiveIntensity={0.2}
    />
  );

  return (
    <group position={[0, 4.4, -0.6]}>
      {/* Stick */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.01, 1.5, 8]} />
        <meshPhysicalMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>

      <Center position={[0, 0.8, 0]}>
        <group>
          <Text3D
            font="https://unpkg.com/three@0.77.0/examples/fonts/optimer_bold.typeface.json"
            size={0.45}
            height={0.06}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.01}
            position={[-0.1, 0.4, 0]}
          >
            Happy
            {goldMaterial}
          </Text3D>
          <Text3D
            font="https://unpkg.com/three@0.77.0/examples/fonts/optimer_bold.typeface.json"
            size={0.6}
            height={0.06}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.01}
            position={[0.2, -0.2, 0]}
          >
            Birthday
            {goldMaterial}
          </Text3D>
          {name && (
            <Text3D
              font="https://unpkg.com/three@0.77.0/examples/fonts/optimer_bold.typeface.json"
              size={0.4}
              height={0.05}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.01}
              position={[0.5, -0.7, 0]}
            >
              {name}
              {goldMaterial}
            </Text3D>
          )}
          {/* Heart Graphic */}
          <mesh position={[3.3, 0.3, 0.03]} scale={[0.04, -0.04, 0.04]} rotation={[0, 0, 0.2]}>
            <extrudeGeometry
              args={[heartShape, { depth: 1.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.5, bevelThickness: 0.5 }]}
            />
            {goldMaterial}
          </mesh>
        </group>
      </Center>
    </group>
  );
}

// ─── Number Candle ────────────────────────────────────────────────────────────
function NumberCandle({
  digit,
  position,
  isBlowing,
  isBlownOut,
}: {
  digit: string;
  position: [number, number, number];
  isBlowing?: boolean;
  isBlownOut: boolean;
}) {
  const flameRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  const curveParams = useMemo(() => {
    const isTwo = digit === '2';
    let pts: THREE.Vector3[];
    if (isTwo) {
      pts = [
        new THREE.Vector3(-0.35, 0.45, 0),
        new THREE.Vector3(-0.15, 0.75, 0),
        new THREE.Vector3(0.25, 0.7, 0),
        new THREE.Vector3(0.3, 0.35, 0),
        new THREE.Vector3(-0.3, -0.3, 0.1),
        new THREE.Vector3(-0.35, -0.45, 0),
        new THREE.Vector3(-0.1, -0.4, -0.1),
        new THREE.Vector3(0.3, -0.35, 0),
        new THREE.Vector3(0.45, -0.1, 0.1),
      ];
    } else {
      pts = [
        new THREE.Vector3(0, 0.65, 0),
        new THREE.Vector3(0.25, 0.4, 0.05),
        new THREE.Vector3(0.35, -0.1, 0),
        new THREE.Vector3(0.15, -0.45, -0.05),
        new THREE.Vector3(-0.15, -0.45, 0),
        new THREE.Vector3(-0.3, -0.1, 0.05),
        new THREE.Vector3(-0.25, 0.4, 0),
      ];
    }
    const curve = new THREE.CatmullRomCurve3(pts, !isTwo, 'catmullrom', 0.5);
    return { curve, isTwo };
  }, [digit]);

  useFrame(({ clock }) => {
    if (!isBlownOut && flameRef.current && glowRef.current) {
      const time = clock.getElapsedTime();
      const flicker =
        Math.sin(time * 25) * 0.04 +
        Math.sin(time * 15) * 0.04 +
        Math.sin(time * 40) * 0.02;
      flameRef.current.scale.set(1 - flicker * 0.5, 1 + flicker * 1.5, 1 - flicker * 0.5);

      let swayX = Math.sin(time * 1.5) * 0.015 + Math.sin(time * 3) * 0.01;
      let swayZ = Math.cos(time * 2) * 0.015 + Math.sin(time * 2.5) * 0.01;
      if (isBlowing) {
        swayX += Math.sin(time * 30) * 0.1;
        swayZ += Math.cos(time * 40) * 0.1 + 0.15;
        flameRef.current.scale.set(0.6, 0.6, 0.6);
      }

      const wOffsetX = curveParams.isTwo ? -0.15 : 0;
      const wOffsetY = curveParams.isTwo ? 1.35 : 1.25;
      flameRef.current.position.set(
        position[0] + wOffsetX + swayX,
        position[1] + wOffsetY,
        position[2] + swayZ,
      );
      flameRef.current.rotation.set(swayZ * 4, 0, -swayX * 4);
      glowRef.current.intensity = isBlowing ? 1.5 + flicker : 2.5 + flicker * 2;
      glowRef.current.position.set(
        position[0] + wOffsetX + swayX,
        position[1] + wOffsetY + 0.1,
        position[2] + swayZ,
      );
    }

    if (isBlownOut && flameRef.current) {
      if (flameRef.current.scale.y > 0.01) {
        flameRef.current.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.1);
      }
      if (glowRef.current && glowRef.current.intensity > 0.01) {
        glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, 0, 0.1);
      }
    }
  });

  const isTwo = curveParams.isTwo;
  const wickOffsetX = isTwo ? -0.15 : 0;

  return (
    <group>
      {/* Number Body */}
      <group position={position}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <tubeGeometry args={[curveParams.curve, 64, 0.08, 16, !isTwo]} />
          <meshPhysicalMaterial
            color="#FFD700"
            roughness={0.2}
            metalness={0.7}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            emissive="#3A2A00"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Wick */}
      <mesh position={[position[0] + wickOffsetX, position[1] + (isTwo ? 1.3 : 1.2), position[2]]}>
        <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Flame group */}
      <group>
        <group
          ref={flameRef}
          position={[position[0] + wickOffsetX, position[1] + (isTwo ? 1.35 : 1.25), position[2]]}
        >
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#FF5500" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#FFAA00" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color="#0055FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <coneGeometry args={[0.035, 0.12, 16]} />
            <meshBasicMaterial color="#FF3300" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <coneGeometry args={[0.045, 0.2, 16]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <coneGeometry args={[0.015, 0.08, 16]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
          </mesh>
          {!isBlownOut && (
            <Sparkles position={[0, 0.15, 0]} count={5} scale={0.4} size={3} speed={0.8} opacity={0.8} color="#FFBB00" />
          )}
        </group>
        <pointLight
          ref={glowRef}
          position={[position[0], position[1] + 1.25, position[2]]}
          color="#FFAA00"
          distance={6}
          decay={2}
          intensity={2.5}
        />
      </group>

      {/* Smoke when blown out */}
      {isBlownOut && (
        <Sparkles
          position={[position[0] + wickOffsetX, position[1] + 1.6, position[2]]}
          count={12}
          scale={0.6}
          size={6}
          speed={1.5}
          opacity={0.5}
          color="#DDDDDD"
        />
      )}
    </group>
  );
}

// ─── Main Cake Export ─────────────────────────────────────────────────────────
export function Cake({
  isBlowing,
  isBlownOut,
  name,
}: {
  isBlowing?: boolean;
  isBlownOut: boolean;
  name?: string;
}) {
  const cakeGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cakeGroup.current) {
      cakeGroup.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={cakeGroup} position={[0, -1.5, 0]}>
      {/* Cake Plate Base */}
      <mesh position={[0, -0.4, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.8, 3.0, 0.4, 128]} />
        <meshPhysicalMaterial color="#9C7747" metalness={0.7} roughness={0.3} clearcoat={1.0} emissive="#100c05" emissiveIntensity={0.5} />
      </mesh>

      {/* Cake Plate Glass Top */}
      <mesh position={[0, -0.18, 0]} receiveShadow>
        <cylinderGeometry args={[2.75, 2.75, 0.1, 128]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.0} metalness={0.5} clearcoat={1} emissive="#444" emissiveIntensity={0.2} />
      </mesh>

      {/* Base Layer — Deep Romantic Red */}
      <CakeLayer radius={2.2} height={1.5} position={[0, 0.65, 0]} color="#8B1E3F" />
      <CakeDrips radius={2.2} count={30} yPos={1.4} color="#FFC4D1" minLength={0.4} maxLength={1.2} />
      <FrostingWaves radius={2.22} yPos={-0.08} color="#FFC4D1" scaleY={0.8} />
      <PearlRing radius={2.28} count={30} yPos={-0.05} />
      <FrostingStars radius={2.1} count={16} yPos={1.45} color="#FFC4D1" />
      <CakeSprinkles radius={2.1} count={30} yPos={1.4} />
      <StarSprinkles radius={2.05} count={15} yPos={1.4} />
      <CakeSprinkles radius={2.2} height={1.5} count={40} yPos={1.4} sidesOnly />
      <StarSprinkles radius={2.2} height={1.5} count={75} yPos={1.4} sidesOnly />

      {/* Middle Layer — Soft Blush Pink */}
      <CakeLayer radius={1.6} height={1.3} position={[0, 2.05, 0]} color="#EFA8B8" />
      <CakeDrips radius={1.6} count={20} yPos={2.7} color="#FFF5F7" minLength={0.3} maxLength={0.9} />
      <FrostingWaves radius={1.62} yPos={1.42} color="#FFF5F7" scaleY={0.8} />
      <PearlRing radius={1.68} count={24} yPos={1.45} />
      <FrostingStars radius={1.5} count={12} yPos={2.75} color="#FFF5F7" />
      <CakeSprinkles radius={1.5} count={20} yPos={2.7} />
      <StarSprinkles radius={1.45} count={15} yPos={2.7} />
      <CakeSprinkles radius={1.6} height={1.3} count={30} yPos={2.7} sidesOnly />
      <StarSprinkles radius={1.6} height={1.3} count={50} yPos={2.7} sidesOnly />

      {/* Top Layer — Soft Ivory Cream */}
      <CakeLayer radius={1.1} height={1.1} position={[0, 3.25, 0]} color="#FFF5F7" />
      <CakeDrips radius={1.1} count={12} yPos={3.8} color="#FFC4D1" minLength={0.2} maxLength={0.6} />
      <FrostingWaves radius={1.12} yPos={2.72} color="#FFC4D1" scaleY={0.8} />
      <PearlRing radius={1.18} count={16} yPos={2.75} />
      <FrostingStars radius={0.9} count={8} yPos={3.85} color="#FFC4D1" />
      <CakeSprinkles radius={1.0} count={15} yPos={3.8} />
      <StarSprinkles radius={0.95} count={15} yPos={3.8} />
      <CakeSprinkles radius={1.1} height={1.1} count={25} yPos={3.8} sidesOnly />
      <StarSprinkles radius={1.1} height={1.1} count={35} yPos={3.8} sidesOnly />

      {/* Number Candles — 20 */}
      <NumberCandle isBlowing={isBlowing} isBlownOut={isBlownOut} digit="2" position={[-0.4, 3.8, 0.2]} />
      <NumberCandle isBlowing={isBlowing} isBlownOut={isBlownOut} digit="0" position={[0.4, 3.8, 0.2]} />

      {/* Happy Birthday Topper */}
      <CakeTopper name={name} />
    </group>
  );
}
