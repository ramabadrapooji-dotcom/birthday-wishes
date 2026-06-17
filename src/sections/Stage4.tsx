import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { PartyBlastAnimation } from '../components/PartyBlastAnimation';
import { VintageEnvelope } from '../components/VintageEnvelope';
import { CakeScene } from '../components/CakeScene';

interface Stage4Props {
  onBack?: () => void;
}

export const Stage4 = ({ onBack }: Stage4Props) => {
  const [showCake, setShowCake] = useState(false);

  return (
    <AnimatePresence mode="wait">
    {showCake ? (
      <CakeScene onBack={() => setShowCake(false)} />
    ) : (
    <>
      {/* Hero Content (lower z-index so decorations appear on top) */}
      <div className="hero relative z-10">
        <div className="left">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Happy<br />Birthday
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="date-pill"
          >
            🎉 30/06/2006 🎉
          </motion.div>
          <br />
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="main-btn"
            onClick={onBack}
          >
            {onBack ? '← Back' : 'Close'}
          </motion.button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="icons"
          >
            <span
              onClick={() => setShowCake(true)}
              title="Open 3D Birthday Cake 🎂"
              style={{ cursor: 'pointer' }}
            >🎂</span>
            <span>🎁</span>
          </motion.div>
        </div>

        <div className="right">
          <VintageEnvelope />
        </div>
      </div>

      <PartyBlastAnimation />

      {/* Decorative Background Elements (higher z-index) */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Top Left Bunting / Flags */}
        <div className="absolute top-0 left-0 w-64 md:w-96 select-none pointer-events-none z-30">
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-12 md:h-16 opacity-100 drop-shadow-lg">
            <polygon points="0,0 20,40 40,0" fill="#ff7ba3" />
            <polygon points="40,0 60,50 80,0" fill="#ff9ebf" />
            <polygon points="80,0 100,40 120,0" fill="#ff7ba3" />
            <polygon points="120,0 140,50 160,0" fill="#ff9ebf" />
          </svg>
        </div>

        {/* Top Right Bunting / Flags */}
        <div className="absolute top-0 right-0 w-64 md:w-96 select-none pointer-events-none z-30">
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-12 md:h-16 opacity-100 scale-x-[-1] drop-shadow-lg">
            <polygon points="0,0 20,40 40,0" fill="#ff7ba3" />
            <polygon points="40,0 60,50 80,0" fill="#ff9ebf" />
            <polygon points="80,0 100,40 120,0" fill="#ff7ba3" />
            <polygon points="120,0 140,50 160,0" fill="#ff9ebf" />
          </svg>
        </div>

        {/* Party Hat */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0, rotate: [-15, 8, -12, 5, -15] }}
          transition={{ y: { duration: 0.8 }, rotate: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute top-[8%] left-[33%] md:left-[28%] select-none z-40"
        >
          <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-xl -rotate-12 filter drop-shadow-[0_5px_15px_rgba(255,75,130,0.4)]">
            {/* Main Cone */}
            <path d="M20 80 L80 80 L50 20 Z" fill="#2d3436" />
            {/* Pink Base Strip / Pattern */}
            <path d="M25 70 L75 70 L80 80 L20 80 Z" fill="#ff4b82" />
            {/* Polka Dots */}
            <circle cx="35" cy="35" r="5" fill="#ff4b82" />
            <circle cx="65" cy="35" r="5" fill="#ff4b82" />
            <circle cx="45" cy="45" r="5" fill="#ff4b82" />
            <circle cx="55" cy="55" r="5" fill="#ff4b82" />
            <circle cx="40" cy="65" r="5" fill="#ff4b82" />
            {/* Pompom Top */}
            <circle cx="50" cy="15" r="12" fill="#ff4b82" />
          </svg>
        </motion.div>

        {/* Balloon 1 (Right) */}
        <motion.div
          animate={{ y: [-30, 20, -30], x: [-5, 5, -5], rotate: [-12, 0, -12] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[12%] right-[8%] md:right-[12%] w-20 h-24 shadow-xl z-30"
          style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', background: '#ffaec9' }}
        >
          <motion.div 
            className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#ffaec9]"
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-[40px] left-1/2 w-1 h-10 bg-gradient-to-b from-gray-400 to-gray-500"
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* Balloon 2 (Right Mid) */}
        <motion.div
          animate={{ y: [-40, 30, -40], x: [5, -5, 5], rotate: [12, -5, 12] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute bottom-[18%] right-[-15px] md:right-[3%] w-24 h-32 shadow-xl z-30 opacity-95"
          style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', background: '#ff7ba3' }}
        >
          <motion.div 
            className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#ff7ba3]"
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: 0.8 }}
          />
          <motion.div 
            className="absolute -bottom-[40px] left-1/2 w-1 h-12 bg-gradient-to-b from-gray-500 to-gray-600"
            animate={{ rotate: [3, -3, 3] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: 0.8 }}
          />
        </motion.div>

        {/* Diffused Hearts */}
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.5, 1, 0.5], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[65%] left-[38%] z-20"
        >
          <span style={{ fontSize: '40px', color: '#ffb4cc' }}>♥</span>
        </motion.div>

        {/* Extra decorative hearts */}
        <motion.div
          animate={{ y: [10, -25, 10], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-[50%] left-[15%] z-20 opacity-70"
        >
          <span style={{ fontSize: '28px', color: '#ff7ba3' }}>♥</span>
        </motion.div>

        <motion.div
          animate={{ y: [-15, 20, -15], opacity: [0.5, 0.95, 0.5] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[55%] right-[10%] z-20 opacity-75"
        >
          <span style={{ fontSize: '32px', color: '#ffaec9' }}>♥</span>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-[#ff4b82] font-medium opacity-60 z-20 whitespace-nowrap text-center">
        Made with ❤️ for you
      </div>
    </>
    )}
    </AnimatePresence>
  );
};
