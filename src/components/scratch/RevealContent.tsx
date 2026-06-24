import { motion } from 'motion/react';
import { CardContent } from './types';
import { Sparkles, Calendar, Heart, Gift, Award } from 'lucide-react';

interface RevealContentProps {
  content: CardContent;
  isRevealed: boolean;
  className?: string;
}

export const RevealContent = ({ content, isRevealed, className }: RevealContentProps) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full bg-[#FCFBF7] p-6 flex flex-col justify-between select-none z-10 rounded-2xl ${className || ''}`}
      id="reveal-content-container"
    >
      {/* Intricate Luxury Background Grid for the Card Inside */}
      <div className="absolute inset-0 bg-[radial-gradient(#f3ece1_1px,transparent_1.5px)] [background-size:16px_16px] opacity-70 pointer-events-none rounded-2xl" />
      <div className="absolute inset-4 border border-dashed border-[#e6dec8] opacity-60 pointer-events-none rounded-xl" />

      {/* Main card body with reveal animations */}
      {content.type === 'message' && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={isRevealed ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="flex-1 flex flex-col justify-between h-full relative z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#f0e8d5] pb-2">
            <span className="font-mono text-[9px] tracking-widest text-[#a89575] uppercase flex items-center gap-1">
              <Calendar size={10} /> BIRTHDAY SPECIAL
            </span>
            <Heart size={14} className="text-rose-400 fill-rose-400 animate-pulse" />
          </div>

          {/* Central Message */}
          <div 
            className="flex-1 text-center px-2 py-4 overflow-y-auto min-h-0 flex flex-col justify-start custom-scrollbar pointer-events-auto"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            style={{ touchAction: 'pan-y' }}
          >
            <div className="text-4xl mb-3 animate-bounce shrink-0">{content.emoji || '💝'}</div>
            <h3 className="font-serif text-xl font-semibold text-[#544634] tracking-tight mb-2 shrink-0">
              {content.title}
            </h3>
            {content.subtitle && (
              <p className="font-mono text-xs text-[#a39274] italic mb-3 shrink-0">
                {content.subtitle}
              </p>
            )}
            <p className="font-serif text-sm leading-relaxed text-[#6b5c49] max-w-sm mx-auto pb-4">
              {content.body}
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-2 border-t border-[#f0e8d5] text-[9px] font-mono text-[#a89575] uppercase tracking-wider">
            <span>FOR MY SOULMATE</span>
            <span className="flex items-center gap-0.5">
              FOREVER & ALWAYS <Sparkles size={10} className="text-amber-400 fill-amber-400" />
            </span>
          </div>
        </motion.div>
      )}

      {content.type === 'photo' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isRevealed ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="flex-1 flex flex-col justify-between h-full relative z-10"
        >
          {/* Polaroid style frame */}
          <div className="bg-white p-3 pb-5 shadow-sm border border-[#ece7d5] rounded-sm transform rotate-[-1deg] my-auto">
            <div className="relative aspect-video w-full overflow-hidden rounded bg-[#f7f5ee] flex items-center justify-center group">
              {content.image ? (
                <img
                  src={content.image}
                  alt="Birthday Memory"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <Heart size={32} className="text-rose-300 mx-auto mb-2 animate-pulse" />
                  <span className="text-[10px] font-mono text-[#a39274]">IMAGE URL EMPTY</span>
                </div>
              )}
              {/* Overlay sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none" />
            </div>
            
            <div className="text-center mt-3">
              <span className="font-serif text-base text-[#4c3f2d] italic block">
                {content.title || 'Me & You • Sweet Moments 💌'}
              </span>
              <span className="font-mono text-[9px] text-[#a39274] uppercase tracking-wider">
                {content.subtitle || 'June 30, 2006 • Infinite Love'}
              </span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] font-serif text-[#8f7e65] mt-1 italic">
            "{content.body}"
          </div>
        </motion.div>
      )}

      {content.type === 'coupon' && (
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.95 }}
          animate={isRevealed ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="flex-1 flex flex-col justify-between h-full relative z-10"
        >
          {/* Voucher design */}
          <div className="border-2 border-dashed border-[#d5caad] p-4 rounded-xl flex-1 flex flex-col justify-between bg-radial from-[#ffffff] to-[#faf9f5]">
            <div className="flex justify-between items-center text-rose-500">
              <Award size={20} className="text-amber-400" />
              <span className="font-mono text-[10px] tracking-widest text-[#a89575] font-semibold">
                ROMANTIC TICKET
              </span>
              <Gift size={20} className="text-rose-400" />
            </div>

            <div className="text-center my-auto px-1 py-2">
              <span className="text-xs font-mono text-amber-500 tracking-wider block uppercase mb-1">
                ★ CERTIFICATE OF SURPRISE ★
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#44382c] tracking-tight leading-tight my-1">
                {content.title}
              </h2>
              <p className="font-mono text-xs text-[#a39274] my-2 underline decoration-rose-300 underline-offset-4">
                {content.subtitle || 'Redeemable anytime with a cuddle 🧸'}
              </p>
              <p className="font-serif text-sm text-[#70604d] leading-relaxed italic">
                "{content.body}"
              </p>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-[#a89575]">
              <span>TICKET NO: #LOVE-777-99</span>
              <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                100% VALID FOREVER
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
