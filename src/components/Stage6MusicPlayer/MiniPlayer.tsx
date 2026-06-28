import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Track } from './types';

interface MiniPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  togglePlay: () => void;
}

export function MiniPlayer({ currentTrack, isPlaying, togglePlay }: MiniPlayerProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full py-1.5 pl-2 pr-1.5 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:hidden">
      <div className="w-8 h-8 rounded-full overflow-hidden shadow-inner shrink-0 relative">
        <img 
          src={currentTrack.cover} 
          alt={currentTrack.title} 
          className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} 
        />
      </div>
      <div className="flex flex-col flex-1 max-w-[120px] overflow-hidden">
        <span className="text-xs font-semibold text-white truncate">{currentTrack.title}</span>
        <span className="text-[10px] text-pink-300/80 truncate">{currentTrack.artist}</span>
      </div>
      <button 
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(236,72,153,0.5)] hover:scale-105 transition-transform"
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current text-white" /> : <Play className="w-4 h-4 fill-current text-white ml-0.5" />}
      </button>
    </div>
  );
}
