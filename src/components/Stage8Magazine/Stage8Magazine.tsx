import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import HTMLFlipBook from 'react-pageflip';
import { pages } from './PageContent';
import { Particles as MagazineParticles } from './Particles';

const PageCover = React.forwardRef<HTMLDivElement, { children: React.ReactNode, className?: string }>((props, ref) => {
  return (
    <div className={`page page-cover bg-[#121212] overflow-hidden ${props.className || ''}`} ref={ref} data-density="hard">
      {/* Oily / Glossy Finish Overlay */}
      <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none z-40 bg-gradient-to-tr from-white/0 via-white/50 to-white/0" />
      <div className="w-full h-full relative z-10">
        {props.children}
      </div>
    </div>
  );
});

const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode, number?: number }>((props, ref) => {
  return (
    <div className="page bg-[#f5e3c3] relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.08)] border-r border-[#d4be99]" ref={ref}>
       {/* Paper Micro-Texture */}
       <div className="absolute inset-0 opacity-[0.5] mix-blend-multiply pointer-events-none z-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
       
       {/* Oily / Glossy Finish Overlay */}
       <div className="absolute inset-0 opacity-[0.6] mix-blend-overlay pointer-events-none z-40 bg-gradient-to-tr from-white/0 via-white/50 to-white/0" />
       
       <div className="w-full h-full relative z-10">
         {props.children}
       </div>
       {/* Spine shadow */}
       <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-50 mix-blend-multiply" />
    </div>
  );
});

interface Stage8MagazineProps {
  onBack?: () => void;
}

export function Stage8Magazine({ onBack }: Stage8MagazineProps) {
  const bookRef = useRef<any>(null);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const calculateShift = () => {
    // Center the book if it's on the cover
    if (currentPage === 0) return '-25%'; 
    if (currentPage === pages.length) return '25%'; // Or handle back cover if the flipbook extends that far
    return '0%';
  };

  useEffect(() => {
    let mounted = true;
    // Wait for fonts and document to be ready
    document.fonts.ready.then(() => {
      // Small delay to ensure CSS has applied and layout is stable
      if (mounted) setTimeout(() => setIsReady(true), 150);
    });
    
    // Fallback if fonts.ready takes too long
    const fallbackTimer = setTimeout(() => {
      if (mounted) setIsReady(true);
    }, 400);

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        bookRef.current?.pageFlip()?.flipNext();
      } else if (e.key === 'ArrowLeft') {
        bookRef.current?.pageFlip()?.flipPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Responsive scaling - to perfectly fit exactly on any device
    const handleResize = () => {
      const availableWidth = window.innerWidth;
      const availableHeight = window.innerHeight;
      
      // The book has two pages side by side: 320 * 2 = 640px wide. 450px high.
      const bookWidth = 640;
      const bookHeight = 450;
      
      // Calculate scale to fit inside window while leaving some padding
      const scaleX = (availableWidth * 0.92) / bookWidth;
      const scaleY = (availableHeight * 0.8) / bookHeight;
      
      // Max scale to prevent it getting obscenely huge on big screens
      setScale(Math.min(scaleX, scaleY, 1.5));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#111] overflow-hidden font-sans relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1816] to-[#2a1a1a] opacity-80 pointer-events-none" />

      {/* Back Button */}
      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="fixed top-6 left-6 z-[200] px-5 py-2.5 bg-gradient-to-r from-amber-800/80 to-yellow-900/80 hover:from-amber-700 hover:to-yellow-800 backdrop-blur-md text-amber-100 border border-amber-500/40 rounded-full shadow-[0_0_15px_rgba(180,120,40,0.4)] transition-all font-medium flex items-center gap-2 cursor-pointer text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Music
        </motion.button>
      )}
      
      <main className="relative z-10 w-full h-full flex items-center justify-center min-h-screen">
        <div className="w-full h-full min-h-screen flex items-center justify-center overflow-hidden relative font-sans" style={{ perspective: '1000px' }}>
          
          <MagazineParticles />

          {/* Background Lighting/VFX */}
          <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
            <div 
              className="w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px] rounded-full opacity-30" 
              style={{ background: 'radial-gradient(circle, rgba(120,53,15,0.4) 0%, rgba(0,0,0,0) 70%)' }} 
            />
          </div>

          <motion.div
            className="relative flex items-center justify-center z-10 w-full h-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 30 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          >
            <div 
              className="relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{ 
                transform: `scale(${scale}) translateX(${calculateShift()})`, 
                transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' 
              }}
            >
              {/* @ts-ignore - react-pageflip types require all props even if optional */}
              <HTMLFlipBook 
                width={320} 
                height={450} 
                size="fixed" 
                maxShadowOpacity={0.65} 
                drawShadow={true}
                showCover={true} 
                usePortrait={false}
                useMouseEvents={true}
                swipeDistance={30}
                className="flip-book shadow-[0_0_20px_rgba(0,0,0,0.3)] mx-auto"
                style={{ margin: '0 auto' }}
                ref={bookRef}
                onFlip={(e: any) => setCurrentPage(e.data)}
              >
                {/* Front Cover */}
                <PageCover>{pages[0]}</PageCover>
                
                {/* Inside Pages */}
                {pages.slice(1, pages.length - 1).map((content, idx) => (
                   <Page key={`page-${idx+1}`} number={idx+1}>{content}</Page>
                ))}
                
                {/* Back Cover */}
                <PageCover className="rounded-l-sm bg-[#111]">{pages[pages.length - 1]}</PageCover>
              </HTMLFlipBook>
            </div>

            {/* UI Hints - fixed so it never overlaps scaled magazine */}
            <motion.div 
               className="fixed bottom-6 left-1/2 -translate-x-1/2 text-[#c8aa81] text-[0.65rem] md:text-xs tracking-[0.4em] uppercase font-sans z-50 pointer-events-none flex items-center gap-4 md:gap-6 opacity-60 w-[90%] md:w-auto mx-auto justify-center"
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.6 }}
               transition={{ delay: 2, duration: 1 }}
            >
              <span className="whitespace-nowrap">&larr; Swipe Corners</span>
              <span className="w-8 md:w-12 h-[1px] bg-[#c8aa81]/50 shrink-0"></span>
              <span className="whitespace-nowrap">Or Use Arrows &rarr;</span>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
