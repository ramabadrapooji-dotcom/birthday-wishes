import { motion } from 'motion/react';
import React, { useEffect } from 'react';
import { PopEffectProps } from '../types';

export const PopEffect: React.FC<PopEffectProps> = ({ x, y, message, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{ scale: [0, 1, 0], x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_5px_#fef08a]"
        />
      ))}
      <motion.div
        initial={{ y: 0, opacity: 0, scale: 0.5 }}
        animate={{ y: -70, opacity: [0, 1, 1, 0], scale: 1.1 }}
        transition={{ duration: 2, times: [0, 0.1, 0.8, 1] }}
        className="whitespace-nowrap text-pink-100 font-romantic text-2xl drop-shadow-[0_0_8px_rgba(255,192,203,0.9)]"
        style={{ transform: 'translateX(-50%)' }}
      >
        {message}
      </motion.div>
    </div>
  );
};
