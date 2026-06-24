import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart } from 'lucide-react';
import { ScratchCard } from './scratch/ScratchCard';
import { soundSynth } from './scratch/SoundSynthesizer';

interface ScratchCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchCardModal = ({ isOpen, onClose }: ScratchCardModalProps) => {
  // Start ambient music when modal opens, stop when it closes
  useEffect(() => {
    if (isOpen) {
      soundSynth.startAmbientMusic();
    } else {
      soundSynth.stopAmbientMusic();
    }
    return () => {
      soundSynth.stopAmbientMusic();
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const romanticContent = {
    type: 'message' as const,
    title: 'Happy Birthday, My Angel! 🎂',
    subtitle: 'To the prettiest soul in the entire universe',
    body: 'Whenever life gets heavy, remember I am right here holding your hand. You deserve all the stars, pampering and kisses today! I cherish every sweet memory we made. Here is to making a million more! Your smile is the most precious thing to me, keep smiling and I promise to keep it shining forever. Lets face everything together, lets travel together for entire life. I love you more than words can say. 💕 I Love You Poojiii,...',
    emoji: '💝'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="scratch-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Popout Modal */}
          <motion.div
            key="scratch-modal"
            initial={{ opacity: 0, scale: 0.5, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, y: 80 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 22,
              mass: 0.9,
            }}
            className="fixed inset-0 z-[210] flex items-center justify-center pointer-events-none px-4 py-6"
          >
            <div
              className="relative w-full max-w-md pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glowing card shell */}
              <div className="relative bg-transparent rounded-3xl overflow-hidden">
                {/* Ambient glow ring behind the card */}
                <div
                  className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse, rgba(251,191,36,0.6) 0%, rgba(244,114,182,0.3) 60%, transparent 100%)'
                  }}
                />

                {/* Header section */}
                <div className="relative z-10 bg-gradient-to-br from-[#1a0f00]/95 via-[#2d1a00]/90 to-[#1a0f00]/95 backdrop-blur-xl rounded-3xl border border-amber-500/20 shadow-[0_0_60px_rgba(251,191,36,0.15),0_25px_60px_rgba(0,0,0,0.6)] p-5">
                  
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-500/20 text-rose-300 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-rose-500/30 flex items-center gap-1 shadow-[0_0_15px_rgba(244,114,182,0.2)]">
                        <Heart size={10} className="fill-rose-300" /> A SURPRISE FOR YOU
                      </span>
                    </div>
                    
                    {/* Close button */}
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-white/60 hover:text-white transition-all duration-200 active:scale-90"
                      aria-label="Close gift card"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Title */}
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FDE047] via-[#FFFBEB] to-[#FCE7F3] tracking-tight leading-tight text-center mb-5">
                    Scratch to Reveal 💌
                  </h1>

                  {/* The actual scratch card */}
                  <ScratchCard
                    foilType="gold"
                    content={romanticContent}
                    brushSize={42}
                    className="w-full"
                  />

                  {/* Bottom hint */}
                  <p className="text-center text-[10px] font-mono text-amber-400/50 mt-3 tracking-wide">
                    Use your finger or mouse to scratch away the gold coating ✨
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
