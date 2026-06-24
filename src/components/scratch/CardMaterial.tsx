import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface CardMaterialProps {
  children: React.ReactNode;
  isRevealed: boolean;
  className?: string;
}

export const CardMaterial = ({ children, isRevealed, className }: CardMaterialProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Setup Motion values for smooth spring-based 3D physics tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring configuration for super silky luxury damping response
  const springConfig = { damping: 25, stiffness: 120, mass: 0.8 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);

  // Dynamic shadows and lighting reflection gradients shifting with tilt position
  const shineX = useTransform(x, [-0.5, 0.5], [100, 0]);
  const shineY = useTransform(y, [-0.5, 0.5], [100, 0]);
  const shadowX = useTransform(x, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(y, [-0.5, 0.5], [30, -10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate cursor coordinates normalized from -0.5 to 0.5 relative to the card's dimensions
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth return to default flat position
    x.set(0);
    y.set(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const touchX = e.touches[0].clientX - rect.left - width / 2;
    const touchY = e.touches[0].clientY - rect.top - height / 2;

    x.set(Math.max(-0.5, Math.min(0.5, touchX / width)));
    y.set(Math.max(-0.5, Math.min(0.5, touchY / height)));
  };

  const handleTouchEnd = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="flex items-center justify-center p-4 select-none"
      style={{ perspective: '1200px' }}
      id="3d-perspective-viewport"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? 1.02 : 1.0,
        }}
        transition={{ duration: 0.3 }}
        className={`relative w-full max-w-[420px] aspect-[4/5] sm:aspect-[1.586/1] bg-[#FCFBF7] rounded-2xl cursor-grab active:cursor-grabbing border-4 border-[#F3EFE0] ${className || ''}`}
        id="physical-3d-card"
      >
        {/* Realistic Card Depth Thickness Border */}
        <div 
          className="absolute inset-0 rounded-2xl border-b-[6px] border-r-[4px] border-[#E4DBC5] pointer-events-none z-0" 
          style={{ transform: 'translateZ(-1px)' }}
        />

        {/* Shifting Soft Shadow Layer - shifts dynamically with card tilt */}
        <motion.div
          className="absolute inset-2 rounded-3xl bg-neutral-900/15 filter blur-xl pointer-events-none -z-10 transition-opacity duration-300"
          style={{
            x: shadowX,
            y: shadowY,
            transform: 'translateZ(-25px)',
          }}
        />

        {/* Luxury Front Layer Base */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden z-10 flex flex-col justify-between"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Card core children elements */}
          {children}

          {/* Shifting Foil Reflection Shine overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 transition-opacity duration-300 z-25"
            style={{
              background: useTransform(
                [shineX, shineY],
                ([sx, sy]) => `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) ${sx}%, rgba(255,255,255,0.7) ${sy}%, rgba(255,255,255,0) 100%)`
              )
            }}
            id="card-metallic-shine"
          />

          {/* Golden Embossed outer frame of the entire gift card */}
          <div className="absolute inset-2 border border-[#E6DEC8] opacity-25 rounded-xl pointer-events-none z-22" />
        </div>
      </motion.div>
    </div>
  );
};
