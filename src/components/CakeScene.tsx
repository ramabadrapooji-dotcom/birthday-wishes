import { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, PresentationControls, Float, Sparkles, useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as THREE from 'three';
import { Cake } from './Cake3D';

interface CakeSceneProps {
  onBack: () => void;
}

const TYPEWRITER_TEXT = "To the most my special one ❤️.Every moment with you makes my moments with special and very beautiful gift.We faced a lots of misunderstandings ,lots of happiness , you make my every day special when i'm with you 🫂 ,if u have any thoughts to leave but i cant bear it and even at difficult situations i can't let you leave you ,if you call me at any situation i will definitely be there to support you , even you won't any help from me but i will definitely will be there as atleast indirectly helping you.You are my supporter 💕 , my world 🫂, Keep smiling at every situation 😊,be my one 🩵,face any situation with bravely  ,u r my 7 minutes misammaaa 🫠, tqqqq so much for the memories poojammaa 🤍, happy birthday my soulmate (pooji), my supporter🫂, my one , my 7 minutes🫠, my wife😅 , my partner✨, my world 🌏,my loveee ❤️ .";

const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
    }, 60);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <motion.p 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
      className="mt-8 text-xl md:text-3xl tracking-wide text-rose-100/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md z-30"
      style={{ fontFamily: '"Dancing Script", cursive' }}
    >
      {displayedText}
      <span className="animate-pulse">|</span>
    </motion.p>
  );
};

const Meteors = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(35)].map((_, i) => (
        <span 
          key={i} 
          className="meteor" 
          style={{
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 3 + 2}s`
          }}
        />
      ))}
    </div>
  );
};

const CinematicCamera = ({ step }: { step: string }) => {
  const { camera } = useThree();
  const vec = new THREE.Vector3();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    let targetX = 0, targetY = 2, targetZ = 9;
    
    if (step === 'intro') {
      targetX = Math.sin(t * 0.15) * 1.5;
      targetY = 2 + Math.sin(t * 0.2) * 0.5;
      targetZ = 9 + Math.cos(t * 0.15) * 1;
    } else if (step === 'blowing') {
      targetX = Math.sin(t * 2) * 0.1; // slight shake
      targetY = 2.5;
      targetZ = 8.5;
    } else if (step === 'particles') {
      targetX = 0;
      targetY = 2.5;
      targetZ = 12;
    } else if (step === 'message') {
      targetX = Math.sin(t * 0.1) * 3;
      targetY = 2;
      targetZ = 10;
    }
    
    vec.set(targetX, targetY, targetZ);
    camera.position.lerp(vec, 0.015);
    camera.lookAt(0, 1.2, 0);
  });
  return null;
};

const ResponsiveScale = ({ children }: { children: React.ReactNode }) => {
  const { viewport } = useThree();
  const scale = Math.min(0.75, viewport.width / 8);
  const posY = scale < 0.8 ? (0.8 - scale) * -2 : 0;
  
  return (
    <group scale={scale} position={[0, posY, 0]}>
      {children}
    </group>
  );
};

const MagicalEnvironment = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vh] bg-rose-500/10 blur-[100px] rounded-full mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[20vh] bg-yellow-400/10 blur-[80px] rounded-full mix-blend-screen" />
    </motion.div>
  );
};

const ParticleTextReveal = ({ onComplete }: { onComplete: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let isCompleting = false;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const offscreen = document.createElement('canvas');
      const octx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!octx) return;
      
      offscreen.width = window.innerWidth;
      offscreen.height = window.innerHeight;
      
      octx.fillStyle = 'white';
      const fontSize = window.innerWidth < 640 ? Math.min(window.innerWidth / 10, 45) : Math.min(window.innerWidth / 14, 110);
      octx.font = `bold ${fontSize}px Georgia, serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      
      // Draw text to form target dots (split to 2 lines on smaller screens)
      if (window.innerWidth < 640) {
        octx.fillText('HAPPY', offscreen.width / 2, offscreen.height / 2 - fontSize * 1.5);
        octx.fillText('BIRTHDAY', offscreen.width / 2, offscreen.height / 2);
        octx.fillText('MADAM GAARU ❤️', offscreen.width / 2, offscreen.height / 2 + fontSize * 1.5);
      } else {
        octx.fillText('HAPPY BIRTHDAY', offscreen.width / 2, offscreen.height / 2 - fontSize * 0.6);
        octx.fillText('MADAM GAARU ❤️', offscreen.width / 2, offscreen.height / 2 + fontSize * 0.8);
      }
      
      const imgData = octx.getImageData(0, 0, offscreen.width, offscreen.height).data;
      
      particles = [];
      const density = window.innerWidth < 640 ? 3 : 5; 
      
      for (let y = 0; y < offscreen.height; y += density) {
        for (let x = 0; x < offscreen.width; x += density) {
          const idx = (y * offscreen.width + x) * 4;
          if (imgData[idx + 3] > 128) { // If pixel is drawn
             const isHeart = Math.random() > 0.95;
             particles.push({
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 100, // rise from cake center
                y: window.innerHeight * 0.65 + Math.random() * 50, // candle height approx
                targetX: x,
                targetY: y,
                size: Math.random() * 1.5 + 0.8,
                color: isHeart ? '#FF1493' : (Math.random() > 0.5 ? '#FFD700' : '#FFC0CB'), // Deep pink, gold, light pink
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * -8 - 2, // shoot upwards
                delay: Math.random() * 80, // scattered start
                life: 0
             });
          }
        }
      }
      
      // Randomly shuffle particles
      for (let i = particles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [particles[i], particles[j]] = [particles[j], particles[i]];
      }
    };

    init();

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let settledCount = 0;
      
      particles.forEach(p => {
         if (frame < p.delay) {
            // drifting smoke phase
            p.x += Math.sin(frame * 0.05 + p.delay) * 0.5;
            p.y -= 1;
            ctx.globalAlpha = 0.3;
         } else {
            ctx.globalAlpha = 1;
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            p.vx += dx * 0.003;
            p.vy += dy * 0.003;
            p.vx *= 0.86;
            p.vy *= 0.86;
            
            p.x += p.vx;
            p.y += p.vy;
            
            if (dist < 2 && Math.abs(p.vx) < 0.5 && Math.abs(p.vy) < 0.5) {
               p.x = p.targetX;
               p.y = p.targetY;
               settledCount++;
            }
         }
         
         ctx.fillStyle = p.color;
         ctx.beginPath();
         ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
         ctx.fill();
      });
      ctx.globalAlpha = 1;
      
      if (settledCount > particles.length * 0.85 && !isCompleting) {
         isCompleting = true;
         setTimeout(() => {
            onComplete();
         }, 800); 
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    window.addEventListener('resize', init);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
    };
  }, [onComplete]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

const LoadingScreen = () => {
  const { active } = useProgress();
  
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-50 bg-[#050814] flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-6"></div>
          <p className="text-xl md:text-2xl text-rose-200 tracking-widest animate-pulse" style={{ fontFamily: '"Dancing Script", cursive' }}>wait with love madam jiii</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const CakeScene = ({ onBack }: CakeSceneProps) => {
  const [step, setStep] = useState<'intro' | 'blowing' | 'particles' | 'message'>('intro');
  const [showScript, setShowScript] = useState(false);

  useEffect(() => {
    if (step === 'message') {
      const timer = setTimeout(() => {
        setShowScript(true);
      }, 4500); 

      const duration = 5000;
      const animationEnd = Date.now() + duration;
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          startVelocity: 30, spread: 360, ticks: 60, zIndex: 100,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#D4AF37', '#FFD700', '#FFDF00', '#FFFFFF', '#FFB6C1'],
          shapes: ['square', 'circle']
        });
        confetti({
          startVelocity: 30, spread: 360, ticks: 60, zIndex: 100,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#D4AF37', '#FFD700', '#FFDF00', '#FFFFFF', '#FFB6C1'],
          shapes: ['square', 'circle']
        });
      }, 250);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [step]);

  const handleMakeWish = () => {
    setStep('blowing');
    
    // Hold blowing state for less time to make reaction faster
    setTimeout(() => {
      // Start magical particle collection
      setStep('particles');
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 w-full h-[100dvh] overflow-hidden bg-[#050814] bg-gradient-to-br from-[#0C1226] via-[#050814] to-[#010206] font-sans text-white"
    >
      <LoadingScreen />
      <Meteors />

      {/* Back Button */}
      <motion.button
        className="absolute top-6 left-6 z-[100] px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white backdrop-blur-md transition-all font-sans text-sm tracking-wider flex items-center gap-2"
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>←</span> Back to Letter
      </motion.button>

      {/* 3D Canvas Experience */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 9], fov: 45 }} shadows dpr={[1, 1.2]}>
          <ambientLight intensity={0.5} color="#FFD1E0" />
          <directionalLight position={[8, 10, 5]} intensity={1.5} color="#FFEAC2" castShadow shadow-mapSize={[512, 512]} shadow-camera-near={0.5} shadow-camera-far={25} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-0.0001} />
          <directionalLight position={[-8, 5, -5]} intensity={0.5} color="#A7ACCB" />
          <pointLight position={[0, 4, 2]} intensity={step === 'message' ? 2 : 0} color="#FFC0CB" decay={2} distance={10} />
          
          <CinematicCamera step={step} />

          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-0.1, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            snap
            enabled={step !== 'blowing'}
          >
            <Float rotationIntensity={0.1} floatIntensity={0.1} speed={1}>
              <ResponsiveScale>
                <Cake isBlowing={step === 'blowing'} isBlownOut={step === 'particles' || step === 'message'} name="pooji" />
              </ResponsiveScale>
            </Float>
          </PresentationControls>

          <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={20} blur={2.5} far={4} color="#000000" resolution={256} frames={1} />
          <Environment preset="city" environmentIntensity={0.3} />
          
          {/* Magical atmosphere particles */}
          <Sparkles count={150} scale={20} size={2.5} speed={0.2} opacity={0.4} color="#FFD700" />
          <Sparkles count={100} scale={15} size={5} speed={0.4} opacity={0.3} color="#FFC0CB" />
          {/* Star sprinkles in the outer periphery */}
          <Sparkles count={120} scale={35} size={6} speed={0.2} opacity={0.5} color="#ffffff" />
          <Sparkles count={80} scale={40} size={4} speed={0.1} opacity={0.6} color="#B0E0E6" />
          {/* Cake sparkles */}
          <Sparkles count={50} position={[0, -0.5, 0]} scale={5} size={3} speed={0.5} opacity={0.7} color="#FFF8D6" />
        </Canvas>
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-end p-12">
        <AnimatePresence>
          {step === 'intro' && (
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={handleMakeWish}
              className="pointer-events-auto px-8 py-4 bg-rose-600/30 backdrop-blur-md border border-rose-400/40 text-rose-50 rounded-full text-xl md:text-2xl font-serif tracking-widest hover:bg-rose-500/40 active:scale-95 transition-all duration-150 shadow-[0_0_20px_rgba(225,29,72,0.3)] flex items-center gap-3"
            >
              Blow the candle with love <span className="text-2xl ml-2">❤️</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Particle Formative Sequence Layer */}
      <AnimatePresence>
        {step === 'particles' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(12px)', scale: 1.05 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            <ParticleTextReveal onComplete={() => setStep('message')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Reveal */}
      <AnimatePresence>
        {step === 'message' && (
          <motion.div 
            className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <MagicalEnvironment />
            
            <motion.div
              className="text-center w-full pb-8 relative z-10 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            >
              <h1 className="py-4 flex justify-center items-center gap-6 flex-wrap leading-normal text-center w-full relative">
                {/* Glowing backlight */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-rose-300 to-yellow-300 blur-[80px] opacity-30 mix-blend-screen"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {['HAPPY', 'BIRTHDAY', 'POOJI'].map((word, wordIdx) => (
                  <span key={wordIdx} className="flex whitespace-nowrap relative mx-2">
                    {word.split('').map((char, charIdx) => (
                      <motion.span
                        key={charIdx}
                        initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ 
                          duration: 2,
                          ease: [0.2, 0.8, 0.2, 1],
                          delay: (wordIdx * 5 + charIdx) * 0.08 
                        }}
                        className="inline-block pb-4 pt-2 text-4xl md:text-6xl lg:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-br from-[#FFF8D6] via-[#FFD700] to-[#FF8C00] tracking-wider drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
                <motion.span
                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ 
                    duration: 2,
                    ease: [0.2, 0.8, 0.2, 1],
                    delay: 2 
                  }}
                  className="inline-block pb-4 pt-2 text-4xl md:text-6xl lg:text-7xl drop-shadow-[0_0_20px_rgba(255,100,100,0.6)] mx-2 flex-shrink-0"
                >
                  🫂 ❤️
                </motion.span>
              </h1>
            </motion.div>
            
            {showScript && (
              <div className="flex flex-col items-center z-10 relative px-4 w-full max-w-3xl max-h-[50vh] overflow-y-auto pointer-events-auto pb-12 overscroll-contain">
                <Typewriter text={TYPEWRITER_TEXT} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
