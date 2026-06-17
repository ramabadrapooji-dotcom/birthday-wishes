import { Heart } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { ENVELOPE_COVER_URL } from '../constants';
import { HeartParticleCanvas } from './HeartParticleCanvas';

export const VintageEnvelope = () => {
  const [isOpen, setIsOpen] = useState(false);
  const floatRef = useRef<HTMLDivElement>(null);

  const toggleEnvelope = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isOpen || !floatRef.current) return;
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      floatRef.current.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
    },
    [isOpen],
  );

  const handleMouseLeave = useCallback(() => {
    if (!floatRef.current || isOpen) return;
    floatRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  }, [isOpen]);

  return (
    <div
      className="vintage-keepsake relative w-full max-w-[550px] p-4"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <HeartParticleCanvas />

      <div ref={floatRef} className="vintage-floating vintage-ambient-shadow relative z-10">
        <div className="vintage-caption text-center mb-6">
          <span className="vintage-script-text text-xl md:text-2xl tracking-wide">
            All u need is love from me
          </span>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-50">
          <div className="vintage-brass-clip" />
        </div>

        <div
          className={`vintage-envelope-container relative aspect-[1.6/1] w-full vintage-parchment rounded-sm overflow-hidden cursor-pointer group ${isOpen ? 'open' : ''}`}
          onClick={toggleEnvelope}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleEnvelope();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={isOpen ? 'Close envelope' : 'Open envelope'}
        >
          <div className="vintage-letter-content absolute inset-x-8 bottom-8 top-12 bg-white/90 shadow-inner flex flex-col items-center justify-center text-center px-10 z-10">
            <h3 className="vintage-font-headline text-[#963546] italic mb-2 text-lg md:text-xl">
              My Dearest Love
            </h3>
            <div className="w-12 h-px bg-[#a68a56]/30 mb-4" />
            <p className="vintage-font-body text-[#6b5a5d]/80 leading-relaxed text-sm italic">
              Every moment with you is a treasure I keep close to my heart. May our story continue to
              unfold in the most beautiful ways.
            </p>
            <div className="mt-6 text-[#963546] text-xl">❦</div>
          </div>

          <div
            className={`absolute inset-0 z-30 transition-opacity duration-700 pointer-events-none ${isOpen ? 'opacity-0' : 'opacity-100'}`}
          >
            <img
              alt="Our Love"
              className="w-full h-full object-cover mix-blend-multiply opacity-90"
              src={ENVELOPE_COVER_URL}
              draggable={false}
            />
            <div className="absolute inset-0 bg-[#a68a56]/10 mix-blend-overlay" />
          </div>

          <div className="vintage-envelope-flap absolute inset-0" />

          {!isOpen && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 transition-all duration-300">
              <div className="flex flex-col items-center space-y-4">
                <div className="vintage-wax-seal">
                  <Heart className="text-white/80 w-5 h-5" fill="currentColor" strokeWidth={0} />
                </div>
                <button
                  type="button"
                  className="bg-[#963546]/90 hover:bg-[#963546] text-white vintage-font-body uppercase tracking-[0.2em] px-8 py-3 rounded shadow-xl backdrop-blur-sm transition-all text-[11px] font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEnvelope();
                  }}
                >
                  Unfold to See Love
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <span className="vintage-font-body italic text-[#a68a56]/80 tracking-widest text-[11px] uppercase">
            made with love from your soulmate Mr.Ram
          </span>
        </div>
      </div>
    </div>
  );
};
