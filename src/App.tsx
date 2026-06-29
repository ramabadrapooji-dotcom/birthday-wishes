import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Cake } from './components/Cake3D';

// Components
import { EntryPage } from './components/EntryPage';
import { Login } from './components/Login';
import { Heart } from './components/Heart';
import { PopEffect } from './components/PopEffect';
import { BackgroundTwinkle } from './components/BackgroundTwinkle';
import { Stage4 } from './sections/Stage4';
import Stage5 from './sections/Stage5';
import Stage6 from './sections/Stage6';
import { Stage6MusicPlayer as Stage7 } from './components/Stage6MusicPlayer';
import { Stage8Magazine } from './components/Stage8Magazine';
import Stage9Universe from './components/Stage9Universe';

// Constants & Types
import { messages, interactiveMessages, MUSIC_URL, ENVELOPE_COVER_URL, PHOTO_URL } from './constants';
import { generateHeartsData } from './services/heartService';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showStage4, setShowStage4] = useState(false);
  const [showStage5, setShowStage5] = useState(false);
  const [showStage6, setShowStage6] = useState(false);
  const [showStage7, setShowStage7] = useState(false);
  const [showStage8, setShowStage8] = useState(false);
  const [showStage9, setShowStage9] = useState(false);
  const [key, setKey] = useState(0); 
  const [pops, setPops] = useState<{ id: number; x: number; y: number; message: string }[]>([]);
  const [popIndex, setPopIndex] = useState(0);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Background Preloader for all heavy assets
  useEffect(() => {
    const timer = setTimeout(() => {
      // 1. Preload general images (photos & stickers)
      const imagesToPreload = [
        PHOTO_URL,
        ENVELOPE_COVER_URL,
        'https://media.tenor.com/qUZZxO1HUPcAAAAi/mocha-bear-hearts.gif',
      ];

      // Add Stage 5 reaction GIFs (both assets folder and public folder paths)
      for (let i = 0; i <= 7; i++) {
        try {
          imagesToPreload.push(new URL(`./assets/reaction-${i}.gif`, import.meta.url).href);
        } catch {}
        imagesToPreload.push(`/reaction-${i}.gif`);
      }

      // Add Stage 5 celebration GIFs
      try {
        imagesToPreload.push(new URL('./assets/celebration.gif', import.meta.url).href);
      } catch {}
      imagesToPreload.push(`/celebration.gif`);

      // Add Stage 8 Magazine Photos
      const magPhotos = ['frontcover.jpg', 'backcover.jpg', 'bg-p3.jpg', 'photo-inside-bg-1.jpg', 'photo-inside-bg-2.jpg'];
      for (let i = 1; i <= 27; i++) {
        const ext = (i === 24 || i === 26 || i === 27) ? 'jpeg' : 'jpg';
        magPhotos.push(`photo-p${i}.${ext}`);
      }
      
      magPhotos.forEach(photo => {
        try {
          imagesToPreload.push(new URL(`./assets/${photo}`, import.meta.url).href);
        } catch {}
        imagesToPreload.push(`/magazine-photos/${photo}`);
      });

      // Add Stage 6 puzzle photo
      try {
        imagesToPreload.push(new URL('./assets/puzzle-photo.jpg', import.meta.url).href);
      } catch {}
      imagesToPreload.push('/puzzle-photo.jpg');

      // Add Stage 9 Memory Photos
      for (let i = 1; i <= 9; i++) {
        const ext = i === 9 ? 'jpeg' : 'jpg';
        try {
          imagesToPreload.push(new URL(`./assets/mem${i}.${ext}`, import.meta.url).href);
        } catch {}
        imagesToPreload.push(`/assets/mem${i}.${ext}`);
      }

      // Trigger standard Image loads (caching in browser memory/HTTP cache)
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });

      // 2. Preload Audio/Music file
      const audio = new Audio();
      audio.src = MUSIC_URL;

      // Preload Stage 7 playlist music in background
      const getAssetUrl = (filename: string) => {
        try {
          return new URL(`./assets/${filename}`, import.meta.url).href;
        } catch {
          return `/assets/${filename}`;
        }
      };

      const stage7Playlist = [
        getAssetUrl('song1.mp3'),
        getAssetUrl('song2.mp3'),
        getAssetUrl('song3.mp3'),
        getAssetUrl('song4.mp3'),
        getAssetUrl('song5.mp3'),
        getAssetUrl('song6.mp3'),
        getAssetUrl('song7.mp3'),
        getAssetUrl('song8.mp3'),
        getAssetUrl('song9.mp3'),
        getAssetUrl('song10.mp3'),
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
      ];
      stage7Playlist.forEach(src => {
        const a = new Audio();
        a.src = src;
        a.preload = 'auto';
      });

      // 3. Preload 3D Font JSON file via fetch (cached by browser)
      fetch('https://unpkg.com/three@0.77.0/examples/fonts/optimer_bold.typeface.json')
        .catch(err => console.log('Font preload skipped/offline:', err));

    }, 1200); // 1.2s delay to prioritize critical landing page assets

    return () => clearTimeout(timer);
  }, []);

  const startExperience = () => {
    setHasStarted(true);
    setIsMusicPlaying(true);
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const goToHome = useCallback(() => {
    setShowStage4(false);
    setShowStage5(false);
    setShowStage6(false);
    setShowStage7(false);
    setShowStage8(false);
    setShowStage9(false);
    setHasStarted(false);
  }, []);

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
              {showStage9 ? (
                <motion.div
                  key="stage9-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Stage9Universe onBack={() => setShowStage9(false)} onHome={goToHome} />
                </motion.div>
              ) : showStage8 ? (
                <motion.div
                  key="stage8-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Stage8Magazine onBack={() => setShowStage8(false)} onNext={() => setShowStage9(true)} onHome={goToHome} />
                </motion.div>
              ) : showStage7 ? (
                <motion.div
                  key="stage7-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Stage7 onBack={() => setShowStage7(false)} onNext={() => setShowStage8(true)} />
                </motion.div>
              ) : showStage6 ? (
                <motion.div
                  key="stage6-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Stage6 onNext={() => setShowStage7(true)} onBack={() => setShowStage6(false)} />
                </motion.div>
              ) : showStage5 ? (
                <motion.div
                  key="stage5-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Stage5 onNext={() => setShowStage6(true)} onBack={() => setShowStage5(false)} />
                </motion.div>
              ) : showStage4 ? (
                <motion.div
                  key="stage4-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Stage4 onBack={() => setShowStage4(false)} onNext={() => setShowStage5(true)} />
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

      {/* Hidden WebGL Pre-Compiler / Shader Pre-Loader */}
      {hasStarted && !showStage4 && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', opacity: 0.01, pointerEvents: 'none', overflow: 'hidden', zIndex: -100 }}>
          <Canvas camera={{ position: [0, 2, 9], fov: 45 }} shadows dpr={1}>
            <ambientLight intensity={0.5} color="#FFD1E0" />
            <directionalLight position={[8, 10, 5]} intensity={1.5} color="#FFEAC2" />
            <Cake isBlowing={false} isBlownOut={false} name="pooji" />
          </Canvas>
        </div>
      )}
    </main>
  );
}
