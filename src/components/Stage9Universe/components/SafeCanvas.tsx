import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { Canvas, CanvasProps } from '@react-three/fiber';

interface SafeCanvasProps extends Omit<CanvasProps, 'children'> {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SafeCanvas({ children, fallback, ...props }: SafeCanvasProps) {
  const [contextLost, setContextLost] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL context lost. Entering recovery mode...');
      setContextLost(true);
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored. Re-initializing engine...');
      // Small delay to ensure resources can be safely recreated
      setTimeout(() => {
        setContextLost(false);
      }, 500);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('webglcontextlost', handleContextLost);
      container.addEventListener('webglcontextrestored', handleContextRestored);
    }

    return () => {
      if (container) {
        container.removeEventListener('webglcontextlost', handleContextLost);
        container.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, []);

  if (contextLost) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
        <div className="text-xl mb-4 font-mono">Restoring WebGL Context...</div>
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full" style={{ background: '#020205' }}>
      <Canvas style={{ background: '#020205' }} {...props}>
        {children}
      </Canvas>
    </div>
  );
}
