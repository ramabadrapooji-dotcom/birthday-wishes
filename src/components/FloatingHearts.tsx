import { motion } from 'motion/react';
import React, { useMemo } from 'react';

export const FloatingHearts = () => {
  const hearts = useMemo(() => Array.from({ length: 15 }), []);
  return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {hearts.map((_, i) => (
              <motion.div
                  key={i}
                  initial={{ opacity: 0, y: "110vh", x: `${Math.random() * 100}vw`, scale: 0.5 + Math.random() * 1 }}
                  animate={{ opacity: [0, 0.4, 0], y: "-10vh" }}
                  transition={{ duration: 20 + Math.random() * 20, repeat: Infinity, delay: Math.random() * 10, ease: "linear" }}
                  className="absolute text-pink-500/10 text-3xl"
              >
                  ❤️
              </motion.div>
          ))}
      </div>
  );
};
