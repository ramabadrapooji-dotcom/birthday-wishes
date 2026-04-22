/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

// --- CONFIGURATION ---
const RECIPIENT_NAME = "Special Someone"; // <-- CHANGE THIS TO HER NAME
const MUSIC_URL = "https://www.bensound.com/bensound-music/bensound-love.mp3"; // Optional: Add a direct link to an MP3

const messages = [
  `Hey ${RECIPIENT_NAME} 💞`,
  "Happy Birthday 🎂",
  "May God bless you 🌟",
  "And give a many happiness 🌈",
  "Just saying... you're pretty awesome 💖",
  "Sending good vibes and maybe a wink 😉",
  "Hope u have a great day today ❤️"
];

const Heart = ({ delay, x, y, size, color }: { delay: number; x: number; y: number; size: number; color: string }) => (
  <motion.path
    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    fill={color}
    initial={{ scale: 0, opacity: 0, x, y }}
    animate={{ scale: size, opacity: 1 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    style={{ transformOrigin: 'center' }}
  />
);

const TypewriterText = ({ text, delay, onComplete }: { text: string; delay: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay, onComplete]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-white text-lg md:text-xl font-medium mb-1 drop-shadow-lg"
    >
      {displayedText}
      {displayedText.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "steps(2)" }}
          className="inline-block w-1 h-5 bg-pink-400 ml-1 translate-y-1"
        />
      )}
    </motion.p>
  );
};

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [key, setKey] = useState(0); // For resetting animations
  const [completedMessages, setCompletedMessages] = useState(0);

  const startExperience = () => {
    setHasStarted(true);
    setIsMusicPlaying(true);
    // Note: To actually play music, you'd handle an <audio> element here
  };

  const resetExperience = useCallback(() => {
    setKey(prev => prev + 1);
    setShowText(false);
    setCompletedMessages(0);
    // Tree reset logic is automatic because of the 'key'
    setTimeout(() => setShowText(true), 4000);
  }, []);

  useEffect(() => {
    if (hasStarted) {
      const timer = setTimeout(() => setShowText(true), 4000);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, key]);

  // Generate a bunch of hearts in a heart shape
  const hearts = Array.from({ length: 120 }).map((_, i) => {
    const angle = (i / 120) * 2 * Math.PI;
    const t = angle;
    const hX = 16 * Math.pow(Math.sin(t), 3);
    const hY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    const jitter = Math.random() * 5;
    const scale = 5 + Math.random() * 5;
    
    return {
      x: 200 + hX * scale + (Math.random() - 0.5) * jitter * 10,
      y: 180 + hY * scale + (Math.random() - 0.5) * jitter * 10,
      size: 0.2 + Math.random() * 0.4,
      color: `hsl(${330 + Math.random() * 60}, ${70 + Math.random() * 30}%, ${50 + Math.random() * 20}%)`,
      delay: 2 + Math.random() * 2
    };
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8 overflow-hidden font-sans select-none relative">
      
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center z-50 px-4 text-center"
          >
            <motion.h1 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-white text-3xl md:text-5xl font-bold mb-8 tracking-tighter"
            >
              For someone special... ✨
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startExperience}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-[0_0_20px_rgba(219,39,119,0.4)] transition-colors"
            >
              <Play size={24} fill="currentColor" />
              Open Message
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key={`experience-${key}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto"
          >
            {/* Tree Section */}
            <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
              <svg viewBox="0 0 400 400" className="w-full h-full max-h-[500px]">
                <motion.path
                  d="M200,400 Q200,300 200,200"
                  stroke="#ec4899"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.path
                  d="M200,300 Q250,250 300,200"
                  stroke="#ec4899"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
                />
                <motion.path
                  d="M200,300 Q150,250 100,200"
                  stroke="#ec4899"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
                />
                <motion.path
                  d="M200,250 Q230,220 250,150"
                  stroke="#f472b6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.5, duration: 1, ease: "easeInOut" }}
                />
                <motion.path
                  d="M200,250 Q170,220 150,150"
                  stroke="#f472b6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.5, duration: 1, ease: "easeInOut" }}
                />
                <motion.path
                  d="M200,200 Q200,150 200,100"
                  stroke="#f472b6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.8, duration: 1, ease: "easeInOut" }}
                />

                {hearts.map((heart, i) => (
                  <Heart key={i} {...heart} />
                ))}
              </svg>

              {/* Floating particles */}
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 0.4, 0], 
                    scale: [0, 1, 0],
                    y: -100 - Math.random() * 200,
                    x: (Math.random() - 0.5) * 400
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 4, 
                    repeat: Infinity, 
                    delay: Math.random() * 5 
                  }}
                  className="absolute w-2 h-2 rounded-full bg-pink-300 pointer-events-none blur-sm"
                  style={{ left: '50%', top: '60%' }}
                />
              ))}
            </div>

            {/* Text Section */}
            <div className="flex-1 flex flex-col items-start justify-center min-w-[300px] mt-8 md:mt-0 md:pl-12 w-full">
              <div className="min-h-[300px] w-full flex flex-col justify-center">
                {showText && messages.map((msg, i) => (
                  <TypewriterText 
                    key={`${key}-${i}`} 
                    text={msg} 
                    delay={i * 2} 
                    onComplete={() => setCompletedMessages(prev => prev + 1)}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              {completedMessages >= messages.length && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex gap-4"
                >
                  <button
                    onClick={resetExperience}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg backdrop-blur-sm transition-all border border-white/10 group"
                  >
                    <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    Replay
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Controls */}
      {hasStarted && (
        <div className="fixed top-8 right-8 z-50 flex gap-2">
          <button
            onClick={() => setIsMusicPlaying(!isMusicPlaying)}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10"
          >
            {isMusicPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      )}

      {/* Background Decor */}
      <div className="fixed inset-0 bg-radial-gradient from-transparent to-black pointer-events-none opacity-60" />
    </main>
  );
}
