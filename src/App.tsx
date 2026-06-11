import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';

// Components
import { EntryPage } from './components/EntryPage';
import { Login } from './components/Login';
import { Heart } from './components/Heart';
import { PopEffect } from './components/PopEffect';
import { BackgroundTwinkle } from './components/BackgroundTwinkle';
import { Stage4 } from './sections/Stage4';

// Constants & Types
import { messages, interactiveMessages, MUSIC_URL } from './constants';
import { generateHeartsData } from './services/heartService';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showStage4, setShowStage4] = useState(false);
  const [key, setKey] = useState(0); 
  const [pops, setPops] = useState<{ id: number; x: number; y: number; message: string }[]>([]);
  const [popIndex, setPopIndex] = useState(0);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const startExperience = () => {
    setHasStarted(true);
    setIsMusicPlaying(true);
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const resetExperience = useCallback(() => {
    setKey(prev => prev + 1);
    setShowText(false);
    setPops([]);
    setPopIndex(0);
    setTimeout(() => setShowText(true), 4000);
  }, []);

  const handlePop = useCallback((id: number, x: number, y: number) => {
    const newPop = {
      id: Date.now() + id,
      x,
      y,
      message: interactiveMessages[popIndex % interactiveMessages.length]
    };
    setPops(prev => [...prev, newPop]);
    setPopIndex(prev => prev + 1);
  }, [popIndex]);

  useEffect(() => {
    if (hasStarted) {
      const timer = setTimeout(() => setShowText(true), 4000);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, key]);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) audioRef.current.play().catch(e => console.log(e));
      else audioRef.current.pause();
    }
  }, [isMusicPlaying]);

  const heartsData = useMemo(() => generateHeartsData(key), [key]);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden font-sans select-none relative">
      <audio ref={audioRef} src={MUSIC_URL} loop />
      
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <motion.div key="entry-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0">
            <EntryPage onEnter={() => setHasEntered(true)} />
          </motion.div>
        ) : !isLogged ? (
          <motion.div key="login-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0">
            <Login onSuccess={() => setIsLogged(true)} />
          </motion.div>
        ) : (
          <motion.div key="content-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-black z-[50]">
            <BackgroundTwinkle />
            <AnimatePresence mode="wait">
              {showStage4 ? (
                <motion.div
                  key="stage4-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Stage4 onBack={() => setShowStage4(false)} />
                </motion.div>
              ) : !hasStarted ? (
                <motion.div
                  key="start-screen"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center justify-center z-50 px-6 text-center w-full h-full"
                >
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-pink-100 text-5xl md:text-8xl font-romantic mb-12 drop-shadow-[0_0_30px_rgba(255,192,203,0.6)]"
                  >
                    For you... ✨
                  </motion.h1>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startExperience}
                    className="bg-gradient-to-r from-pink-600 to-rose-500 text-white px-12 py-4 md:px-16 md:py-6 rounded-full font-bold text-xl md:text-3xl shadow-[0_0_40px_rgba(225,29,72,0.45)] transition-all cursor-pointer"
                  >
                    Open Message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key={`experience-${key}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto z-10 gap-2 md:gap-4 overflow-hidden px-4 py-6 md:py-0"
                >
                  <div className="relative w-full max-w-[85vw] md:max-w-2xl aspect-square flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_20px_rgba(190,24,93,0.3)]">
                      <motion.path
                        d="M200,400 Q200,320 200,240"
                        stroke="#8e244d"
                        strokeWidth="12"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5 }}
                      />
                      <g className="opacity-60">
                          <motion.path d="M200,300 Q260,260 340,160" stroke="#be185d" strokeWidth="4.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1.2 }} />
                          <motion.path d="M200,300 Q140,260 60,160" stroke="#be185d" strokeWidth="4.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1.2 }} />
                          <motion.path d="M270,240 Q310,210 350,180" stroke="#db2777" strokeWidth="3" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 1.2 }} />
                          <motion.path d="M130,240 Q90,210 50,180" stroke="#db2777" strokeWidth="3" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 1.2 }} />
                          <motion.path d="M200,260 Q200,180 200,100" stroke="#db2777" strokeWidth="2.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 1 }} />
                          {/* Small Romantic Twigs */}
                          <motion.path d="M240,280 Q260,265 280,250" stroke="#be185d" strokeWidth="1.8" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.4, duration: 0.8 }} />
                          <motion.path d="M160,280 Q140,265 120,250" stroke="#be185d" strokeWidth="1.8" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.4, duration: 0.8 }} />
                          <motion.path d="M200,200 Q230,180 260,160" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.6, duration: 0.7 }} />
                          <motion.path d="M200,200 Q170,180 140,160" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.6, duration: 0.7 }} />
                          {/* Even smaller twigs */}
                          <motion.path d="M230,180 Q240,160 250,140" stroke="#be185d" strokeWidth="1.2" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.8, duration: 0.6 }} />
                          <motion.path d="M170,180 Q160,160 150,140" stroke="#be185d" strokeWidth="1.2" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.8, duration: 0.6 }} />
                          <motion.path d="M200,150 Q210,130 220,110" stroke="#db2777" strokeWidth="0.8" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.0, duration: 0.5 }} />
                          <motion.path d="M200,150 Q190,130 180,110" stroke="#db2777" strokeWidth="0.8" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.0, duration: 0.5 }} />
                      </g>
    
                      {heartsData.map((heart) => (
                        <Heart {...heart} onPop={handlePop} key={heart.id} />
                      ))}
                    </svg>
    
                    <div className="absolute inset-0 pointer-events-none">
                      {pops.map(pop => (
                        <PopEffect 
                          key={pop.id} 
                          x={(pop.x / 400) * 100 + "%"} 
                          y={(pop.y / 400) * 100 + "%"} 
                          message={pop.message}
                          onComplete={() => setPops(prev => prev.filter(p => p.id !== pop.id))}
                        />
                      ))}
                    </div>
                  </div>
    
                  <div className="flex-1 flex flex-col items-center md:items-start justify-center min-w-[240px] w-full relative z-20 px-2 md:px-0 md:pl-12">
                    <div className="min-h-[80px] md:min-h-[300px] w-full flex flex-col justify-center text-center md:text-left">
                      {showText && messages.map((msg, i) => (
                        <motion.p
                          key={`${key}-${i}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 2, duration: 0.8 }}
                          className="text-white text-[13px] md:text-3xl font-romantic mb-1 md:mb-2 drop-shadow-md leading-tight"
                        >
                          {msg}
                        </motion.p>
                      ))}
                    </div>
    
                    {hasStarted && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: messages.length * 2 + 1 }}
                        className="mt-4 md:mt-10 flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start"
                      >
                        <button
                          onClick={resetExperience}
                          className="flex items-center gap-2 bg-pink-500/20 text-pink-100 px-4 py-2 rounded-xl backdrop-blur-md border border-pink-500/30 hover:bg-pink-500/30 transition-all font-romantic text-xs md:text-lg"
                        >
                          <RotateCcw size={14} /> Watch Again
                        </button>
                        <button
                          onClick={() => setShowStage4(true)}
                          className="flex items-center gap-2 bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-100 px-4 py-2 rounded-xl backdrop-blur-md border border-pink-400/50 hover:from-pink-500/50 hover:to-rose-500/50 transition-all font-romantic text-xs md:text-lg"
                        >
                          Next ✨
                        </button>
                        <button
                          onClick={() => {
                            setIsLogged(false);
                            setHasStarted(false);
                            setIsMusicPlaying(false);
                          }}
                          className="flex items-center gap-2 bg-white/5 text-white/70 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all font-romantic text-xs md:text-lg"
                        >
                          Back
                        </button>
                        <p className="w-full text-pink-200/30 text-[10px] md:text-sm italic mt-2 font-serif text-center md:text-left">Pop the hearts on the tree for special notes... 💖</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-8 right-8 z-[110] flex gap-3">
        <button
          onClick={() => setIsMusicPlaying(!isMusicPlaying)}
          className="p-4 rounded-full bg-pink-950/20 text-pink-100/40 border border-pink-100/10 backdrop-blur-md hover:bg-pink-500/20 hover:text-pink-100 transition-all"
        >
          {isMusicPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      {hasEntered && isLogged && (
        <div 
          className="fixed inset-0 pointer-events-none opacity-60 z-0" 
          style={{ background: 'radial-gradient(circle at center, rgba(131, 24, 67, 0.2) 0%, #000 80%)' }}
        />
      )}
    </main>
  );
}
