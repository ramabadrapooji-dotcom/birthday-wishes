import { useAppStore } from '../store/useAppStore';
import { memoriesData } from '../data/memories';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';

const TypewriterText = ({ text, delay = 0, speed = 30 }: { text: string, delay?: number, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    setDisplayedText('');
    
    const startTyping = () => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, speed);
      
      return () => clearInterval(interval);
    };

    timeout = setTimeout(startTyping, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return <span>{displayedText}</span>;
};

interface UIProps {
  onBack?: () => void;
  onHome?: () => void;
}

export default function UI({ onBack, onHome }: UIProps) {
  const { 
    appState, 
    setAppState, 
    transitionState,
    selectedMemory, 
    markMemoryViewed, 
    viewedMemories,
    setFinalePhase,
    audioEnabled,
    setAudioEnabled
  } = useAppStore();

  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (appState === 'LOADING') {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [appState]);

  const handleStart = () => {
    setAudioEnabled(true);
    // 0.5s inhale: universe "breathes in" before warp fires
    // During this window everything is still — the silence before launch
    setTimeout(() => {
      setAppState('WARP');
      // After warp sequence, enter explore mode (4500ms = 4000ms explore + 500ms inhale offset)
      setTimeout(() => {
        setAppState('EXPLORE');
      }, 4500);
    }, 500);
  };

  const handleCloseMemory = () => {
    if (selectedMemory) {
      markMemoryViewed(selectedMemory.id);
    }
    // Use transitionState (not setAppState) so prevAppState is correctly recorded
    // This is critical for camera emotional carry-over on RETURN
    transitionState('RETURN');
  };

  const allViewed = viewedMemories.size === memoriesData.length;

  const triggerFinale = () => {
    transitionState('FINAL_BANG');
    // 1.0s silence gap: the universe goes quiet before gravity acts
    setTimeout(() => {
      setFinalePhase(1); // Collapse — gravity begins its slow "thinking"
      
      setTimeout(() => {
        setFinalePhase(2); // Singularity — pulsing, breathing longer (3s from 2s)
        setTimeout(() => {
          setFinalePhase(3); // Explosion & Text arrival
        }, 3000); // singularity: 2s → 3s
      }, 5000); // collapse: 4s → 5s
    }, 1000); // 1.0s silence before collapse starts
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden text-white font-sans">
      
      {/* Audio Toggle */}
      {appState !== 'LOADING' && (
        <button 
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="absolute top-6 right-6 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 pointer-events-auto hover:bg-white/10 transition-colors"
        >
          {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      )}

      {/* Navigation Buttons */}
      {appState !== 'LOADING' && (
        <div className="absolute top-6 left-6 z-[200] flex gap-3 pointer-events-auto">
          {onHome && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHome}
              className="px-4 py-2.5 bg-black/20 hover:bg-white/10 backdrop-blur-md text-white/80 border border-white/10 rounded-full transition-all font-medium flex items-center gap-2 cursor-pointer text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </motion.button>
          )}
          {onBack && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="px-5 py-2.5 bg-black/20 hover:bg-white/10 backdrop-blur-md text-white/80 border border-white/10 rounded-full transition-all font-medium flex items-center gap-2 cursor-pointer text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Magazine
            </motion.button>
          )}
        </div>
      )}

      {/* Loading Screen */}
      <AnimatePresence>
        {appState === 'LOADING' && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="absolute inset-0 bg-[#020205] flex flex-col items-center justify-center pointer-events-auto"
          >
            <h1 className="text-3xl font-light tracking-[0.3em] mb-8 text-white/80">INITIALIZING UNIVERSE</h1>
            
            <div className="w-64 h-[1px] bg-white/20 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white"
                style={{ width: `${loadingProgress}%` }}
                layout
              />
            </div>
            
            <p className="mt-4 text-xs font-mono text-white/40">{loadingProgress}%</p>
            
            {loadingProgress === 100 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleStart}
                className="mt-12 px-8 py-3 tracking-widest text-sm uppercase border border-white/30 hover:bg-white hover:text-black transition-all duration-500"
              >
                Enter Orbit
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warp Flash Overlay — fires during WARP, aligned with inhale + anticipation timing */}
      <AnimatePresence>
        {appState === 'WARP' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.6, 0], transition: { duration: 5, times: [0, 0.55, 0.85, 1] } }}
            className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay z-50"
          />
        )}
      </AnimatePresence>

      {/* Explore UI */}
      <AnimatePresence>
        {appState === 'EXPLORE' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
          >
            <p className="text-sm tracking-widest text-white/60 mb-4">DRAG TO EXPLORE</p>
            
            {/* Memory Tracker */}
            <div className="flex gap-2">
              {memoriesData.map((mem) => (
                <div 
                  key={mem.id} 
                  className={`w-2 h-2 rounded-full transition-all duration-1000 ${
                    viewedMemories.has(mem.id) ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/20'
                  }`} 
                />
              ))}
            </div>

            {allViewed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={triggerFinale}
                className="mt-8 px-8 py-3 bg-white text-black font-medium tracking-widest text-sm pointer-events-auto shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] transition-all duration-500"
              >
                THE FINAL CHAPTER
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Focus UI */}
      <AnimatePresence>
        {appState === 'MEMORY_FOCUS' && selectedMemory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 flex flex-col justify-end p-12 md:p-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
          >
            <div className="max-w-2xl bg-black/30 backdrop-blur-md border border-white/10 p-8 rounded-xl pointer-events-auto">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                className="text-xs md:text-sm font-mono tracking-widest text-white/60 mb-2 uppercase"
              >
                <TypewriterText text={`Date: ${selectedMemory.date} // Location/Place: ${selectedMemory.location}`} delay={500} speed={20} />
              </motion.p>
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.0 } }}
                className="text-3xl md:text-5xl font-light tracking-tight mb-6"
              >
                <TypewriterText text={selectedMemory.emotion} delay={1000} speed={40} />
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.5 } }}
                className="text-lg md:text-xl font-light leading-relaxed text-white/80 min-h-[100px]"
              >
                <TypewriterText text={selectedMemory.story} delay={1500} speed={25} />
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 3 } }}
                onClick={handleCloseMemory}
                className="mt-8 px-6 py-2 border border-white/30 text-sm tracking-widest hover:bg-white hover:text-black transition-colors"
              >
                RETURN TO ORBIT
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
