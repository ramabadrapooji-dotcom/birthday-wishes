import { useRef, useState } from 'react';
import { CardMaterial } from './CardMaterial';
import { ScratchLayer } from './ScratchLayer';
import { RevealContent } from './RevealContent';
import { ScratchParticles, ScratchParticlesRef } from './ScratchParticles';
import { GlowEffect } from './GlowEffect';
import { CardContent } from './types';
import { soundSynth } from './SoundSynthesizer';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface ScratchCardProps {
  foilType?: 'gold' | 'silver' | 'rose-gold' | 'emerald';
  content: CardContent;
  brushSize?: number;
  onRevealComplete?: () => void;
  className?: string;
}

export const ScratchCard = ({
  foilType = 'gold',
  content,
  brushSize = 40,
  onRevealComplete,
  className
}: ScratchCardProps) => {
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const particlesRef = useRef<ScratchParticlesRef | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  // Mouse coordinate tracking for advanced lighting glows
  const [mousePos, setMousePos] = useState({ x: 150, y: 100 });
  const [cardSize, setCardSize] = useState({ width: 400, height: 250 });

  const handleScratchMove = (x: number, y: number) => {
    // Save current mouse coordinates relative to the card size
    setMousePos({ x, y });

    // Emit golden sparkles/dust from the emitter
    if (particlesRef.current) {
      let particleColor = '#FBBF24'; // Gold
      if (foilType === 'silver') particleColor = '#D1D5DB';
      else if (foilType === 'rose-gold') particleColor = '#F472B6';
      else if (foilType === 'emerald') particleColor = '#34D399';

      particlesRef.current.emitScratch(x, y, particleColor, foilType);
    }
  };

  const handleRevealTriggered = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    setScratchPercent(100);

    // Play luxurious major chord sound progression
    soundSynth.playRevealSound();

    // Emit giant explosion of star, heart, and foil particles
    if (particlesRef.current) {
      const colors = foilType === 'gold' 
        ? ['#FBBF24', '#F59E0B', '#FFF9DB', '#F472B6', '#E11D48'] 
        : foilType === 'silver'
        ? ['#D1D5DB', '#9CA3AF', '#FFFFFF', '#F472B6', '#EF4444']
        : foilType === 'rose-gold'
        ? ['#F472B6', '#EC4899', '#FDA4AF', '#FCD34D', '#FFFBEB']
        : ['#34D399', '#10B981', '#A7F3D0', '#FCD34D', '#F472B6'];

      particlesRef.current.emitReveal(cardSize.width, cardSize.height, colors);
    }

    if (onRevealComplete) {
      onRevealComplete();
    }
  };

  const resetCard = () => {
    setIsRevealed(false);
    setScratchPercent(0);
    if (particlesRef.current) {
      particlesRef.current.clear();
    }
  };

  const toggleSound = () => {
    const nextMute = !isSoundMuted;
    setIsSoundMuted(nextMute);
    if (nextMute) {
      soundSynth.stopAmbientMusic();
    } else {
      soundSynth.startAmbientMusic();
    }
  };

  // Capture sizing details of the card shell for particle boundaries
  const handleCardLayoutUpdate = (el: HTMLDivElement | null) => {
    if (!el) return;
    cardContainerRef.current = el;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setCardSize(prev => {
        if (prev.width === rect.width && prev.height === rect.height) return prev;
        return { width: rect.width, height: rect.height };
      });
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className || ''}`} id="scratch-card-master-wrapper">
      {/* Percentage Scratched Floating HUD */}
      <div className="flex items-center gap-4 text-xs font-mono tracking-wider text-[#9E8B6D] mb-1">
        <span className="flex items-center gap-1.5 bg-[#FAF9F5]/80 border border-[#ECE7D5] py-1.5 px-3 rounded-full shadow-xs">
          <Sparkles size={12} className="text-amber-500 fill-amber-500" />
          SCRATCHED: {Math.round(scratchPercent * 100)}%
        </span>
        
        {scratchPercent > 0 && !isRevealed && (
          <span className="animate-pulse text-rose-500 font-semibold font-sans text-[11px]">
            Keep scratching to uncover surprise! ✨
          </span>
        )}

        {isRevealed && (
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-emerald-600 font-sans font-semibold text-[11px] bg-emerald-50 px-2.5 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1"
          >
            🎉 Miracle Revealed!
          </motion.span>
        )}
      </div>

      {/* Main physical 3D card layout container */}
      <div 
        ref={handleCardLayoutUpdate}
        className="relative w-full max-w-[420px]"
        id="scratch-card-interactive-box"
      >
        <CardMaterial isRevealed={isRevealed}>
          {/* Underlay Surprise Content */}
          <RevealContent content={content} isRevealed={isRevealed} />

          {/* Overlaid scratch coating layer */}
          <ScratchLayer
            foilType={foilType}
            brushSize={brushSize}
            isRevealed={isRevealed}
            onScratchProgress={setScratchPercent}
            onScratchMove={handleScratchMove}
            onRevealTriggered={handleRevealTriggered}
          />

          {/* Live canvas sparkles and foil peeling particles */}
          <ScratchParticles ref={particlesRef} />

          {/* Interactive cursor light glows and light bursts */}
          <GlowEffect
            isRevealed={isRevealed}
            mousePos={mousePos}
            cardSize={cardSize}
          />
        </CardMaterial>
      </div>

      {/* Tactical action bar below the card */}
      <div className="flex items-center gap-3 mt-2" id="scratch-card-actions">
        {/* Reset button */}
        <button
          onClick={resetCard}
          className="flex items-center gap-2 bg-[#FAF9F5] border border-[#ECE7D5] text-[#73634C] hover:bg-[#F3EFE0] active:scale-95 duration-200 py-2 px-4 rounded-xl font-medium text-xs shadow-xs"
          id="btn-reset-card"
        >
          <RefreshCw size={13} className="text-[#9E8B6D]" /> Reset Card
        </button>

        {/* Ambient music synthesizer toggle */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl font-medium text-xs duration-200 active:scale-95 border shadow-xs ${
            !isSoundMuted 
              ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' 
              : 'bg-[#FAF9F5] border-[#ECE7D5] text-[#73634C] hover:bg-[#F3EFE0]'
          }`}
          id="btn-toggle-sound"
        >
          {isSoundMuted ? (
            <>
              <VolumeX size={13} className="text-[#9E8B6D]" /> Ambient Music: Off
            </>
          ) : (
            <>
              <Volume2 size={13} className="text-rose-500 animate-pulse" /> Ambient Music: On 🎵
            </>
          )}
        </button>
      </div>
    </div>
  );
};
