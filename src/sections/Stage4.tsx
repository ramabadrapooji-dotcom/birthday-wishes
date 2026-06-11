import { motion } from 'motion/react';

interface Stage4Props {
  onBack?: () => void;
}

export const Stage4 = ({ onBack }: Stage4Props) => {
  return (
    <>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Left Bunting / Flags */}
        <div className="absolute top-0 left-0 w-64 md:w-96 select-none pointer-events-none">
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-12 md:h-16 opacity-90 drop-shadow-sm">
            <polygon points="0,0 20,40 40,0" fill="#ff7ba3" />
            <polygon points="40,0 60,50 80,0" fill="#ff9ebf" />
            <polygon points="80,0 100,40 120,0" fill="#ff7ba3" />
            <polygon points="120,0 140,50 160,0" fill="#ff9ebf" />
          </svg>
        </div>

        {/* Top Right Bunting / Flags */}
        <div className="absolute top-0 right-0 w-64 md:w-96 select-none pointer-events-none">
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-12 md:h-16 opacity-90 scale-x-[-1] drop-shadow-sm">
            <polygon points="0,0 20,40 40,0" fill="#ff7ba3" />
            <polygon points="40,0 60,50 80,0" fill="#ff9ebf" />
            <polygon points="80,0 100,40 120,0" fill="#ff7ba3" />
            <polygon points="120,0 140,50 160,0" fill="#ff9ebf" />
          </svg>
        </div>

        {/* Party Hat */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0, rotate: [-15, 5, -15] }}
          transition={{ y: { duration: 0.8 }, rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute top-[10%] left-[35%] md:left-[30%] select-none z-0"
        >
          <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-md -rotate-12">
            {/* Main Cone */}
            <path d="M20 80 L80 80 L50 20 Z" fill="#2d3436" />
            {/* Pink Base Strip / Pattern */}
            <path d="M25 70 L75 70 L80 80 L20 80 Z" fill="#ff4b82" />
            {/* Polka Dots */}
            <circle cx="35" cy="35" r="4" fill="#ff4b82" />
            <circle cx="65" cy="35" r="4" fill="#ff4b82" />
            <circle cx="45" cy="45" r="4" fill="#ff4b82" />
            <circle cx="55" cy="55" r="4" fill="#ff4b82" />
            <circle cx="40" cy="65" r="4" fill="#ff4b82" />
            {/* Pompom Top */}
            <circle cx="50" cy="15" r="10" fill="#ff4b82" />
          </svg>
        </motion.div>

        {/* Balloon 1 (Right) */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] right-[10%] md:right-[15%] w-16 h-20 shadow-lg -rotate-12 z-0"
          style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', background: '#ffaec9' }}
        >
          <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#ffaec9]" />
          <div className="absolute -bottom-[32px] left-1/2 w-px h-8 bg-gray-400" />
        </motion.div>

        {/* Balloon 2 (Right Mid) */}
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[20%] right-[-20px] md:right-[5%] w-20 h-28 shadow-lg rotate-12 z-0 opacity-80"
          style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', background: '#ff7ba3' }}
        >
          <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#ff7ba3]" />
          <div className="absolute -bottom-[32px] left-1/2 w-px h-8 bg-gray-400" />
        </motion.div>

        {/* Diffused Hearts */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[60%] left-[40%] opacity-40 z-0"
        >
          <span style={{ fontSize: '30px', color: '#ffb4cc' }}>♥</span>
        </motion.div>
      </div>

      {/* Hero Content */}
      <div className="hero">
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
            {/* Update with dynamic date if needed */}
            🎉 Special Day 🎉
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
            <span>🎂</span>
            <span>🎁</span>
          </motion.div>
        </div>

        <div className="right">
          <div className="envelope-card">
            <div className="glow"></div>
            <div className="envelope">
              <div className="heart-seal">💖</div>
              <div className="text" dangerouslySetInnerHTML={{ __html: 'For My<br> Princess<br> Pooji ❤️' }} />
            </div>
          </div>
          <div className="name-tag">♥ Love You So Much ♥</div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-[#ff4b82] font-medium opacity-60 z-20 whitespace-nowrap text-center">
        Made with ❤️ for you
      </div>
    </>
  );
};
