import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface VolumeControlProps {
  gainNodeRef: React.MutableRefObject<GainNode | null>;
  audioCtxRef: React.MutableRefObject<AudioContext | null>;
}

export function VolumeControl({ gainNodeRef, audioCtxRef }: VolumeControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    updateGain(newVolume);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      updateGain(volume);
    } else {
      setIsMuted(true);
      updateGain(0);
    }
  };

  const updateGain = (val: number) => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        val, 
        audioCtxRef.current.currentTime, 
        0.05
      );
    }
  };

  const VolumeIcon = isMuted || volume === 0 
    ? VolumeX 
    : volume < 0.5 
      ? Volume1 
      : Volume2;

  return (
    <div className="relative flex items-center justify-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-white/80 hover:text-pink-400 hover:scale-110 transition-all p-2 relative z-20"
      >
        <VolumeIcon className={`w-6 h-6 ${isMuted || volume === 0 ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-12 right-0 bg-[#110518]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3 z-30 min-w-[120px]"
          >
            <div className="text-xs font-mono text-pink-300 font-semibold tracking-widest uppercase">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </div>
            <div className="h-24 w-12 flex justify-center py-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-1 h-full appearance-none bg-black/50 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-pink-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(236,72,153,0.8)] [&::-webkit-slider-thumb]:cursor-pointer"
                style={{
                  WebkitAppearance: 'slider-vertical' as any
                }}
              />
            </div>
            <button 
              onClick={toggleMute}
              className={`p-2 rounded-full transition-colors ${isMuted ? 'bg-pink-500/20 text-pink-400' : 'bg-white/5 text-white/70 hover:text-white'}`}
            >
              <VolumeIcon className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
