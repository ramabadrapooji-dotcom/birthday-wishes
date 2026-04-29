import { motion } from 'motion/react';
import React, { useState } from 'react';

export const Heart = ({ delay, x, y, size, color, rotate, onPop, id }: { 
  delay: number; x: number; y: number; size: number; color: string, rotate: number, onPop: (id: number, x: number, y: number) => void, id: number
}) => {
  const [isPopped, setIsPopped] = useState(false);

  const handleClick = () => {
    if (isPopped) return;
    setIsPopped(true);
    onPop(id, x, y);
  };

  if (isPopped) return null;

  return (
    <motion.path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
      initial={{ scale: 0, opacity: 0, x: x - 12, y: y - 12, rotate: 0 }}
      animate={{ scale: size, opacity: 1, rotate }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: size * 1.3, cursor: "pointer" }}
      onClick={handleClick}
      style={{ transformOrigin: 'center' }}
    />
  );
};
