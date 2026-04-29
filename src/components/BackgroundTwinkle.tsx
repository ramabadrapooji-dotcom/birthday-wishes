import { motion } from 'motion/react';
import React, { useMemo } from 'react';

export const BackgroundTwinkle = () => {
  const stars = useMemo(() => Array.from({ length: 40 }), []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
          className="absolute w-[2px] h-[2px] bg-white rounded-full"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  );
};
