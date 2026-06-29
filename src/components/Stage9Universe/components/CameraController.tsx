import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';

const ROTATION_SPEED = 0.0005;

export default function CameraController() {
  const { camera } = useThree();
  const { appState, prevAppState, selectedMemory, finalePhase } = useAppStore();
  
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -1));
  const orbitAngle = useRef(0);

  // Emotional carry-over: actual per-frame camera velocity, bleeds into next state
  const velocityRef = useRef(new THREE.Vector3());
  const prevCamPos = useRef(new THREE.Vector3());

  // Post-warp settling: hold target frozen for 0.6s after warp ends so universe "exhales"
  const warpSettleTimer = useRef(0);
  const WARP_SETTLE_DURATION = 0.6;
  
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const mouseRotation = useRef({ x: 0, y: 0 }); // Target rotation offsets
  const currentRotation = useRef({ x: 0, y: 0 }); // Smoothed rotation offsets
  
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    const handlePointerUp = () => {
      isDragging.current = false;
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      if (appState !== 'EXPLORE' && appState !== 'RETURN') return;
      
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      
      mouseRotation.current.x -= deltaX * 0.005;
      mouseRotation.current.y -= deltaY * 0.005;
      
      // Limit vertical rotation
      mouseRotation.current.y = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, mouseRotation.current.y));
      
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    // Add touch support
    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      if (appState !== 'EXPLORE' && appState !== 'RETURN') return;
      
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;
      
      mouseRotation.current.x -= deltaX * 0.005;
      mouseRotation.current.y -= deltaY * 0.005;
      mouseRotation.current.y = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, mouseRotation.current.y));
      
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [appState]);

  useFrame((state, delta) => {
    // Track real camera velocity each frame — used for momentum carry-over on transitions
    velocityRef.current.subVectors(camera.position, prevCamPos.current);
    prevCamPos.current.copy(camera.position);

    // Post-warp settle countdown: if we just left WARP, freeze targeting for WARP_SETTLE_DURATION
    if (prevAppState === 'WARP' && appState !== 'WARP') {
      warpSettleTimer.current += delta;
    } else if (appState === 'WARP') {
      warpSettleTimer.current = 0; // reset when actively warping
    }
    const isSettlingAfterWarp = warpSettleTimer.current < WARP_SETTLE_DURATION && prevAppState === 'WARP' && appState !== 'WARP';

    // Smooth mouse rotation — 2.5 (was 4) gives longer inertia tail so camera coasts after release
    currentRotation.current.x = THREE.MathUtils.damp(currentRotation.current.x, mouseRotation.current.x, 2.5, delta);
    currentRotation.current.y = THREE.MathUtils.damp(currentRotation.current.y, mouseRotation.current.y, 2.5, delta);

    if (isSettlingAfterWarp) {
      // Universe exhales after warp — hold position, let damping coast to rest naturally
      // targetPosition and targetLookAt remain unchanged from last WARP frame
    } else if (appState === 'EXPLORE' || appState === 'LOADING') {
      // Auto slow rotation
      if (!isDragging.current) {
        mouseRotation.current.x += ROTATION_SPEED;
      }
      
      // Calculate look direction based on spherical coordinates
      const spherical = new THREE.Spherical(
        10,
        Math.PI / 2 - currentRotation.current.y,
        currentRotation.current.x
      );
      
      targetLookAt.current.setFromSpherical(spherical);
      targetPosition.current.set(0, 0, 0);
      
    } else if (appState === 'WARP') {
      targetPosition.current.set(0, 0, -50); // Move forward
      
      const spherical = new THREE.Spherical(
        10,
        Math.PI / 2 - currentRotation.current.y,
        currentRotation.current.x
      );
      targetLookAt.current.setFromSpherical(spherical);
      // We want to look far ahead
      targetLookAt.current.add(new THREE.Vector3(0, 0, -100));

    } else if (appState === 'MEMORY_FOCUS' && selectedMemory) {
      // Move towards photo
      const memPos = new THREE.Vector3(...selectedMemory.position);
      
      // Pull back further so we can see both the photo (right) and story panel (left)
      const dir = memPos.clone().normalize();
      const distance = memPos.length();
      targetPosition.current.copy(dir).multiplyScalar(distance - 6.5); // Stop 6.5 units away for wide cinematic framing
      
      targetLookAt.current.copy(memPos);
      
    } else if (appState === 'RETURN') {
      // Return to center — very slow pull so deceleration tail is long and graceful
      targetPosition.current.set(0, 0, 0);
      
      // Maintain current rotation direction
      const spherical = new THREE.Spherical(
        10,
        Math.PI / 2 - currentRotation.current.y,
        currentRotation.current.x
      );
      targetLookAt.current.setFromSpherical(spherical);
      
      // Tighter threshold so the RETURN glide plays out fully before flipping to EXPLORE
      if (camera.position.length() < 0.05) {
        useAppStore.getState().transitionState('EXPLORE');
      }
    } else if (appState === 'FINAL_BANG') {
      if (finalePhase === 1) {
        // Pull back slightly during collapse
        targetPosition.current.set(0, 0, 20);
        targetLookAt.current.set(0, 0, 0);
      } else if (finalePhase === 2) {
        // Shake or hold for singularity
        targetPosition.current.set(0, 0, 30);
        targetLookAt.current.set(0, 0, 0);
      } else if (finalePhase === 3) {
        // Explosion - move around text
        orbitAngle.current += delta * 0.1;
        targetPosition.current.set(
          Math.sin(orbitAngle.current) * 25,
          Math.sin(orbitAngle.current * 0.5) * 5 + 5,
          Math.cos(orbitAngle.current) * 25
        );
        targetLookAt.current.set(0, 0, 0);
      }
    }

    // Cinematic damping — per-state emotional weight:
    //   RETURN      : 0.8  — longest deceleration coast, emotional drift home
    //   FINAL_BANG 1: 0.55 — gravity pull feel, very slow onset
    //   FINAL_BANG 2: 0.85 — singularity hold, steady
    //   FINAL_BANG 3: 1.2  — explosion orbit, responsive cinematic pan
    //   settling    : 0.6  — post-warp exhale, almost frozen
    //   default     : 1.0  — standard heavy gimbal
    let posDamp = 1.0;
    if (appState === 'RETURN')               posDamp = 0.8;
    else if (isSettlingAfterWarp)            posDamp = 0.6;
    else if (appState === 'FINAL_BANG') {
      if      (finalePhase === 1)            posDamp = 0.55;
      else if (finalePhase === 2)            posDamp = 0.85;
      else if (finalePhase === 3)            posDamp = 1.2;
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPosition.current.x, posDamp, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPosition.current.y, posDamp, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPosition.current.z, posDamp, delta);
    
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookAt.current.x, 1.3, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookAt.current.y, 1.3, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookAt.current.z, 1.3, delta);
    
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
