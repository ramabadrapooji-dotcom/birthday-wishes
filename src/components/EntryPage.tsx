import { motion } from 'motion/react';
import React, { useMemo } from 'react';

export const EntryPage = ({ onEnter }: { onEnter: () => void }) => {
  const floatingHearts = useMemo(() => Array.from({ length: 25 }), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#FDF5F2' }} 
    >
      <div className="absolute inset-0 pointer-events-none">
        {floatingHearts.map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: i < 15 ? `${Math.random() * 100}vh` : -100, 
              x: `${Math.random() * 100}vw`,
              opacity: 0,
              scale: 0.4 + Math.random() * 0.8,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: '110vh',
              opacity: [0, 0.9, 0.9, 0],
              x: `${(Math.random() * 100) + (Math.random() - 0.5) * 40}vw`,
              rotate: Math.random() * 720
            }}
            transition={{ 
              duration: 12 + Math.random() * 18,
              repeat: Infinity,
              delay: i < 15 ? 0 : Math.random() * 10,
              ease: "linear"
            }}
            className="absolute"
          >
            <svg width="50" height="50" viewBox="0 0 24 24" fill="#E91E63" stroke="#C2185B" strokeWidth="2" className="opacity-90 drop-shadow-[0_0_15px_rgba(233,30,99,0.6)]">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 flex flex-col items-center">
        <h1 className="text-[#F48FB1] font-romantic text-4xl md:text-6xl mb-12 tracking-[0.2em] opacity-80 text-center px-4">
          A Journey of Love
        </h1>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: '#FCE4EC', color: '#F06292' }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="px-16 py-4 rounded-full border-2 border-[#F48FB1] text-[#F48FB1] font-romantic text-2xl tracking-[0.3em] transition-all duration-500 backdrop-blur-sm"
        >
          ENTER
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
