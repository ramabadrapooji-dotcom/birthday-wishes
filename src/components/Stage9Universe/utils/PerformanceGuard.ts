import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { detectDeviceQuality } from './performance';

export function usePerformanceGuard() {
  const { setQuality, quality } = useAppStore();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lowFpsCount = useRef(0);

  useEffect(() => {
    // Only monitor on Desktop where quality can be HIGH/MEDIUM, or just don't upgrade mobile automatically.
    // If we are already on LOW, we can't go lower.
    if (quality === 'LOW') return;

    let rafId: number;

    const checkPerformance = () => {
      frameCount.current++;
      const time = performance.now();
      const delta = time - lastTime.current;

      // Check every 1 second for tighter budget control
      if (delta > 1000) {
        const fps = (frameCount.current * 1000) / delta;
        
        if (fps < 40) {
          lowFpsCount.current++;
          if (lowFpsCount.current >= 2) { // 2 consecutive periods of low FPS
            console.warn(`Performance Guard: Low FPS detected (${Math.round(fps)}). Downgrading quality.`);
            setQuality(quality === 'HIGH' ? 'MEDIUM' : 'LOW');
            lowFpsCount.current = 0;
          }
        } else if (fps >= 55) {
          lowFpsCount.current = 0; // Reset counter if healthy
        }

        frameCount.current = 0;
        lastTime.current = time;
      }

      rafId = requestAnimationFrame(checkPerformance);
    };

    rafId = requestAnimationFrame(checkPerformance);

    return () => cancelAnimationFrame(rafId);
  }, [quality, setQuality]);
}
