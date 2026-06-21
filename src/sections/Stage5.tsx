import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StickerContainer } from '../components/StickerContainer';
import { Heart, Sparkles } from 'lucide-react';

const PremiumVFX = React.memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Cinematic Ethereal Glows */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.5, 0.4], rotate: [0, 45, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-rose-400 mix-blend-multiply filter blur-[120px]" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3], rotate: [0, -45, 0] }} 
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
        className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-200 mix-blend-multiply filter blur-[150px]" 
      />
      <motion.div 
        animate={{ y: [0, -40, 0], opacity: [0.3, 0.5, 0.3] }} 
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[50vw] rounded-full bg-pink-300 mix-blend-multiply filter blur-[120px]" 
      />

      {/* Expensive Shimmering Dust (Bokeh effect) */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`ambient-dust-${i}`}
          className="absolute rounded-full bg-white shadow-[0_0_15px_4px_rgba(255,255,255,0.8)]"
          style={{
            width: Math.random() * 3 + 2 + 'px',
            height: Math.random() * 3 + 2 + 'px',
          }}
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: Math.random() * 0.4 + 0.3,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100 - 30}vh`],
            opacity: [0, Math.random() * 0.6 + 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
        />
      ))}

      {/* Floating Glassy Hearts */}
      {Array.from({ length: 15 }).map((_, i) => {
          const size = Math.random() * 30 + 20;
          return (
              <motion.div
                  key={`ambient-heart-${i}`}
                  initial={{
                      x: `${Math.random() * 100}vw`,
                      y: `110vh`,
                      rotate: Math.random() * 360,
                      opacity: 0,
                      scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                      y: `-20vh`,
                      rotate: Math.random() * 360 + 180,
                      opacity: [0, 0.7, 0.7, 0]
                  }}
                  transition={{
                      duration: Math.random() * 20 + 20,
                      repeat: Infinity,
                      ease: "linear",
                      delay: Math.random() * 20
                  }}
                  className="absolute text-white/70 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
              >
                  <Heart fill="currentColor" size={size} strokeWidth={1} className="backdrop-blur-sm" />
              </motion.div>
          )
      })}
    </div>
  );
});

const TypewriterText = ({ text, className, onComplete }: { text: string, className?: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    setDisplayedText(""); 
    setIsTyping(true);
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }, 12); // Speed up typewriter rendering to avoid visual lag
    return () => clearInterval(interval);
  }, [text]); // Removed onComplete from deps to prevent retyping on parent re-renders

  return (
    <span className={className}>
      {displayedText}
      {isTyping && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block ml-1">|</motion.span>}
    </span>
  );
};

export default function Stage5({ onNext, onBack }: { onNext?: () => void; onBack?: () => void }) {
  const [yesClicked, setYesClicked] = useState(false);
  const [teaseCount, setTeaseCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const [messageCompleted, setMessageCompleted] = useState(false);

  const getNoButtonText = () => {
    const phrases = [
      "No",
      "Are you serious?",
      "Pookie please...",
      "If you say no, I will be really sad...",
      "I will be very sad...",
      "Please??!",
      "Don't do this to me...",
      "Last chance!!!"
    ];
    return phrases[Math.min(teaseCount, phrases.length - 1)];
  };

  const getImgUrl = () => {
    try {
      if (yesClicked) {
        return new URL('../assets/celebration.gif', import.meta.url).href;
      }
      return new URL(`../assets/reaction-${teaseCount}.gif`, import.meta.url).href;
    } catch {
      return yesClicked ? "/celebration.gif" : `/reaction-${teaseCount}.gif`;
    }
  };

  const handleNoClick = () => {
    if (teaseCount < 7) {
      setTeaseCount(prev => prev + 1);
    }
  };

  const handleNoHover = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault(); // Prevent accidental clicks or scrolling when trying to touch on mobile
    }
    if (teaseCount >= 7) {
      if (noButtonRef.current) {
        const btnWidth = noButtonRef.current.offsetWidth || 100;
        const btnHeight = noButtonRef.current.offsetHeight || 40;
        
        // Define completely safe viewing bounds so the button is always strictly inside the screen
        const padding = 20;
        const maxX = typeof window !== 'undefined' ? window.innerWidth - btnWidth - padding : 300;
        const maxY = typeof window !== 'undefined' ? window.innerHeight - btnHeight - padding : 500;
        
        // Pick random coordinates across the safe area
        const randomX = Math.random() * (maxX - padding) + padding;
        const randomY = Math.random() * (maxY - padding) + padding;
        
        setNoPosition({ x: randomX, y: randomY });
      }
    }
  };

  useEffect(() => {
    if (teaseCount === 7) {
        handleNoHover();
    }
  }, [teaseCount]);

  return (
    <div ref={containerRef} className="relative w-screen h-screen min-h-[100dvh] flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden bg-[#fce4ec] text-slate-800">
      
      {!yesClicked && <PremiumVFX />}
      
      <StickerContainer />

      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="absolute top-6 left-6 md:top-10 md:left-10 z-[120] px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 backdrop-blur-md text-[#e91e63] border border-rose-300/40 rounded-full shadow-sm transition-all font-medium flex items-center gap-2 cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-[#e91e63] text-[#e91e63] animate-pulse" />
          <span className="font-cursive text-sm md:text-base">Back</span>
        </motion.button>
      )}

      {!yesClicked ? (
        <div className="flex flex-col items-center justify-center p-4 z-10 w-full max-w-2xl mx-auto min-h-full">
          
          <h1 className="text-4xl md:text-6xl font-cursive font-bold text-[#e91e63] mb-4 md:mb-8 text-center drop-shadow-md select-none">
            My sweet misammaa , will you be my Valentine? 🥺💖
          </h1>

          <div className="mb-4 md:mb-8 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center relative flex-shrink-0 z-20">
            <div className="absolute inset-0 bg-rose-200/40 rounded-full blur-2xl animate-pulse" />
            
            <img 
              src={getImgUrl()} 
              alt="Reaction animation" 
              className="w-full h-full object-contain pointer-events-none select-none relative z-10 drop-shadow-[0_15px_30px_rgba(233,30,99,0.3)] transition-opacity duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
              }}
            />
            
            <div className="fallback hidden absolute inset-0 flex flex-col items-center justify-center text-rose-400/80 bg-white/30 backdrop-blur-lg rounded-[2rem] border border-white/50 shadow-inner p-4 text-center z-0">
               <Heart className="mb-3 w-8 h-8 md:w-12 md:h-12 opacity-80" />
               <span className="text-xs md:text-sm font-medium leading-snug">
                 Please upload<br/>
                 <b className="text-rose-500 bg-white/50 px-2 py-0.5 rounded-md mt-1 inline-block">reaction-{teaseCount}.gif</b><br/>
                 to src/assets/ or public/
               </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-2 md:mt-4 w-full relative min-h-[160px] z-30">
            <button
              onClick={() => setYesClicked(true)}
              className="bg-[#4CAF50] text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer z-20"
              style={{
                fontSize: `${Math.min(18 + teaseCount * 6, 40)}px`,
                padding: `${Math.min(12 + teaseCount * 4, 30)}px ${Math.min(24 + teaseCount * 8, 50)}px`
              }}
            >
              Yes
            </button>

            <button
              ref={noButtonRef}
              onClick={(e) => teaseCount < 7 ? handleNoClick() : handleNoHover(e)}
              onMouseEnter={teaseCount >= 7 ? handleNoHover : undefined}
              onTouchStart={teaseCount >= 7 ? handleNoHover : undefined}
              className="bg-[#F44336] text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer overflow-hidden select-none transition-all"
              style={
                teaseCount >= 7
                  ? {
                      position: 'fixed',
                      left: `${noPosition.x}px`,
                      top: `${noPosition.y}px`,
                      padding: '12px 24px',
                      fontSize: '18px',
                      zIndex: 100,
                      transition: 'top 0.2s ease-out, left 0.2s ease-out'
                    }
                  : {
                      position: 'static',
                      padding: '12px 24px',
                      fontSize: '18px',
                      zIndex: 10,
                      transition: 'all 0.2s ease-in-out'
                    }
              }
            >
              {getNoButtonText()}
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex flex-col items-center justify-center py-10 px-4 z-10 w-full min-h-full space-y-4 md:space-y-6"
        >
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-cursive font-bold text-[#e91e63] text-center drop-shadow-sm select-none">
           My heart is yours! I knew you'd say yes! 🥰🎉
          </h1>

          <div className="w-40 h-40 md:w-64 md:h-64 flex items-center justify-center relative flex-shrink-0">

            <img 
              src={getImgUrl()} 
              alt="Happy romantic celebration" 
              className="w-full h-full object-contain pointer-events-none select-none relative z-10 drop-shadow-[0_20px_30px_rgba(233,30,99,0.3)]"
              onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
              }}
            />
            
            <div className="fallback hidden absolute inset-0 flex flex-col items-center justify-center text-rose-500 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-inner p-8 text-center text-sm font-medium">
                <Heart className="mb-4 w-12 h-12 md:w-16 md:h-16 opacity-90 fill-rose-500/50" />
                Please upload<br/><b className="bg-white/60 px-2 rounded-md mt-1 inline-block">celebration.gif</b><br/>to src/assets/ or public/
            </div>
          </div>

          <p className="text-xl md:text-2xl lg:text-3xl font-cursive font-bold text-[#e91e63] text-center select-none px-4 min-h-[60px]">
            <TypewriterText 
              text="You've just made me the happiest person in the universe! I love you so much!  , lets be together and make memories and live long together till the end of the life" 
              onComplete={() => setMessageCompleted(true)} 
            />
          </p>

          <AnimatePresence>
            {messageCompleted && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.8 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ type: "spring", bounce: 0.5 }}
                className="flex flex-col items-center mt-2 flex-shrink-0"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 mb-2">
                  <img src="https://media.tenor.com/qUZZxO1HUPcAAAAi/mocha-bear-hearts.gif" alt="Extra happy bear" className="w-full h-full object-contain pointer-events-auto" />
                </div>
                <h3 className="text-xl md:text-3xl font-cursive font-bold text-rose-500 drop-shadow-sm pointer-events-auto mb-8">
                  <TypewriterText text="I love you Poojiii! 💕💖" />
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Persistent Corner Button (Rendered Outside the Transforming Div) */}
      <AnimatePresence>
        {yesClicked && messageCompleted && onNext && (
          <motion.button
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            onClick={onNext}
            className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[120] px-6 md:px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] transition-all pointer-events-auto text-sm md:text-base flex items-center gap-2"
          >
            <span className="animate-pulse text-lg">🎁</span> I have one more surprise...
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expensive Celebration VFX Flow */}
      <AnimatePresence>
        {yesClicked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 pointer-events-none z-[100]"
          >
            {/* Center Burst Explosion */}
            {Array.from({ length: 120 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const velocity = 20 + Math.random() * 60;
              const size = 5 + Math.random() * 8;
              const colors = ['text-pink-400', 'text-[#e91e63]', 'text-red-500', 'text-rose-400', 'text-white'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <motion.div
                  key={`burst-${i}`}
                  initial={{ 
                    x: '50vw', 
                    y: '50vh',
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{ 
                    x: `calc(50vw + ${Math.cos(angle) * velocity}vw)`,
                    y: `calc(50vh + ${Math.sin(angle) * velocity}vh + 20vh)`,
                    scale: Math.random() * 1.5 + 0.5,
                    opacity: 0,
                    rotate: Math.random() * 720 - 360
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 3,
                    ease: "easeOut"
                  }}
                  className={`absolute ${color} drop-shadow-xl`}
                >
                  <Heart fill="currentColor" size={size} />
                </motion.div>
              );
            })}

            {/* Massive Continuous Cinematic Falling Hearts */}
            {Array.from({ length: 125 }).map((_, i) => {
              const size = 6 + Math.random() * 10;
              const delay = Math.random() * 10.0; 
              const duration = 3.0 + Math.random() * 5;
              const startX = Math.random() * 100;
              const colors = ['text-pink-400', 'text-[#e91e63]', 'text-red-500', 'text-rose-300', 'text-white/80'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <motion.div
                  key={`fall-${i}`}
                  initial={{ 
                    opacity: 0, 
                    top: '-10vh', 
                    left: `${startX}vw`,
                    scale: 0.5,
                    rotate: 0
                  }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    top: '120vh', 
                    left: `${startX + (Math.random() * 20 - 10)}vw`,
                    rotate: Math.random() * 1080
                  }}
                  transition={{ 
                    duration, 
                    ease: "linear",
                    delay,
                    repeat: Infinity,
                    times: [0, 0.05, 0.95, 1]
                  }}
                  className={`absolute ${color} drop-shadow-2xl`}
                >
                  <Heart fill="currentColor" size={size} className={colors.includes('white') ? "backdrop-blur-sm" : ""} />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
