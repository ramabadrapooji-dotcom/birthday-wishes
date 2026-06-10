import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { FloatingHearts } from './FloatingHearts';
import { BackgroundTwinkle } from './BackgroundTwinkle';
import { PHOTO_URL, CORRECT_PASSCODE } from '../constants';

const PhotoPlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-br from-pink-900/40 to-black/40 flex flex-col items-center justify-center p-6 text-center">
    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-pink-500/30 flex items-center justify-center mb-3">
      <motion.svg 
        animate={{ scale: [1, 1.2, 1] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-6 h-6 md:w-8 md:h-8 text-pink-500/50" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </motion.svg>
    </div>
    <p className="text-pink-200/50 text-[10px] md:text-sm font-romantic italic leading-tight">
      Imagine our favorite photo here... <br/>
      (Add "login_photo.jpg" to see our magic)
    </p>
  </div>
);

export const Login = ({ onSuccess }: { onSuccess: () => void }) => {
  const [passcode, setPasscode] = useState('');
  const [failCount, setFailCount] = useState(0);
  const [hint, setHint] = useState('');
  const [imgError, setImgError] = useState(false);

  const handleInput = (val: string) => {
    // Use functional update to avoid race conditions on very rapid clicks
    setPasscode(prev => (prev.length < 4 ? prev + val : prev));
  };

  const handleBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (passcode.length === 4) {
      if (passcode === CORRECT_PASSCODE) {
        onSuccess();
      } else {
        const nextFailCount = failCount + 1;
        setFailCount(nextFailCount);
        setPasscode('');
        
        if (nextFailCount === 1) setHint("it was the our both birthday dates");
        else if (nextFailCount === 2) setHint("try again madam jiii,.. the password is my phone password raaa");
        else if (nextFailCount === 3) setHint("try again birthday girl, u really dont know our birthday dates ?");
        else setHint("solve this 143*30-1284");
      }
    }
  }, [passcode, failCount, onSuccess]);

  const photoSrc = PHOTO_URL;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-2 md:p-8 overflow-y-auto overflow-x-hidden"
      style={{ 
        backgroundColor: '#8b0000' 
      }}
    >
      <FloatingHearts />
      <BackgroundTwinkle />
      
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-1 md:gap-12 relative z-10 py-1 md:py-4">
        
        {/* Left Side: Polaroid */}
        <div className="relative group shrink-0">
          <motion.div 
            initial={{ rotate: -5, scale: 0.9, y: 20 }}
            animate={{ rotate: -2, scale: 0.95, y: 0 }}
            className="bg-white p-1.5 pb-2 md:p-4 md:pb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
          >
            {/* Decoration tape */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 md:w-24 h-2 md:h-6 bg-pink-100/40 backdrop-blur-sm -rotate-2 z-30" />
            
            <div className="w-[140px] h-[105px] md:w-[380px] md:h-[300px] bg-gray-200 overflow-hidden relative group border-2 md:border-4 border-white/10">
              {!imgError ? (
                <img 
                  src={photoSrc} 
                  alt="Us" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 object-center opacity-100"
                  onError={() => setImgError(true)}
                />
              ) : (
                <PhotoPlaceholder />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
            
            <div className="mt-1 md:mt-4 text-center">
                <p className="font-romantic text-gray-800 text-sm md:text-2xl opacity-70">Our Magic Moments ✨</p>
            </div>
              <motion.div 
                animate={{ 
                  scale: passcode[i] ? 1.05 : 1,
                  borderColor: passcode[i] ? "rgba(255, 192, 203, 0.8)" : "rgba(255,192,203,0.2)",
                  backgroundColor: passcode[i] ? "rgba(255,192,203,0.15)" : "rgba(0,0,0,0.3)"
                }}
                transition={{ duration: 0.08 }}
                className="w-5 h-7 md:w-10 md:h-14 border-[1.5px] rounded-sm md:rounded-lg transition-all flex items-center justify-center backdrop-blur-xl shadow-[0_0_10px_rgba(0,0,0,0.3)]"
              >

          <div className="flex gap-0.5 md:gap-2 mb-1 md:mb-3">
            {[...Array(4)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  scale: passcode[i] ? 1.05 : 1,
                  borderColor: passcode[i] ? "rgba(255, 192, 203, 0.8)" : "rgba(255,192,203,0.2)",
                  backgroundColor: passcode[i] ? "rgba(255,192,203,0.15)" : "rgba(0,0,0,0.3)"
                }}
                className="w-5 h-7 md:w-10 md:h-14 border-[1.5px] rounded-sm md:rounded-lg transition-all flex items-center justify-center backdrop-blur-xl shadow-[0_0_10px_rgba(0,0,0,0.3)]"
              >
                <AnimatePresence mode="wait">
                  {passcode[i] ? (
                    <motion.span
                      key="num"
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -10 }}
                      className="text-white text-xs md:text-2xl font-romantic font-bold"
                    >
                      {passcode[i]}
                    </motion.span>
                  ) : (
                    <div className="w-0.5 h-0.5 md:w-1.5 md:h-1.5 rounded-full bg-white/20" />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-0.5 md:gap-2 p-0.5 md:p-3 rounded-lg md:rounded-2xl bg-black/20 backdrop-blur-md border border-white/5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((btn, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (typeof btn === 'number') handleInput(btn.toString());
                  else if (btn === 'del') handleBackspace();
                }}
                className={`w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[10px] md:text-xl transition-all duration-300 relative group
                  ${btn === '' ? 'pointer-events-none opacity-0' : 'bg-white/5 border border-white/10 hover:bg-pink-500/40 hover:border-pink-300 active:scale-95 shadow-lg'}
                `}
              >
                {btn === 'del' ? (
                  <span className="text-[4px] md:text-[8px] text-white font-romantic font-bold uppercase">Del</span>
                ) : (
                  <span className="text-white font-romantic font-bold">{btn}</span>
                )}
              </button>
            ))}
          </div>

          {hint && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-1 md:mt-2 text-pink-100/90 text-[8px] md:text-[xs] italic font-serif text-center max-w-[200px] leading-tight">
              {hint}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
