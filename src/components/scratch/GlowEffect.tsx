import { motion } from 'motion/react';

interface GlowEffectProps {
  isRevealed: boolean;
  mousePos: { x: number; y: number };
  cardSize: { width: number; height: number };
  className?: string;
}

export const GlowEffect = ({ isRevealed, mousePos, cardSize, className }: GlowEffectProps) => {
  // Translate mouse coordinate to percentage for radial gradient alignment
  const xPct = cardSize.width > 0 ? (mousePos.x / cardSize.width) * 100 : 50;
  const yPct = cardSize.height > 0 ? (mousePos.y / cardSize.height) * 100 : 50;

  return (
    <>
      {/* 1. Ambient Mouse Glow Layer */}
      <div
        className={`absolute inset-0 pointer-events-none mix-blend-screen z-15 transition-opacity duration-500 ${
          isRevealed ? 'opacity-40' : 'opacity-25'
        } ${className || ''}`}
        style={{
          background: `radial-gradient(circle 180px at ${xPct}% ${yPct}%, rgba(253, 224, 71, 0.25), transparent 70%)`
        }}
        id="ambient-mouse-glow"
      />

      {/* 2. Cinematic Light Burst Flare when Card is Revealed */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 0.8, 0],
            scale: [0.8, 1.3, 1.5, 1.8],
          }}
          transition={{
            duration: 1.6,
            ease: "easeOut"
          }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center mix-blend-screen z-40"
          id="reveal-light-flare"
        >
          {/* Main Flash Burst */}
          <div className="absolute w-72 h-72 rounded-full bg-radial from-amber-200 via-rose-300 to-transparent opacity-85 blur-2xl" />
          
          {/* Sparkle rays */}
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-amber-100 to-transparent rotate-45 transform scale-150" />
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-amber-100 to-transparent -rotate-45 transform scale-150" />
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-rose-100 to-transparent rotate-90 transform scale-150" />
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-rose-100 to-transparent rotate-0 transform scale-150" />
        </motion.div>
      )}
    </>
  );
};
