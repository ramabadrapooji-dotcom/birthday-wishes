import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { X, Play, MoreHorizontal, Upload } from 'lucide-react';
import { Track } from './types';

interface PlaylistProps {
  playlist: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onClose: () => void;
  onSelectTrack: (index: number) => void;
  onAddLocalTrack?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Playlist({ playlist, currentTrackIndex, isPlaying, onClose, onSelectTrack, onAddLocalTrack }: PlaylistProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div 
      initial={{ y: "100%" }} 
      animate={{ y: 0 }} 
      exit={{ y: "100%" }}
      transition={{ type: "spring", bounce: 0, duration: 0.5 }}
      className="absolute inset-0 z-50 bg-[#0a0310]/95 backdrop-blur-3xl flex flex-col p-6"
    >
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col h-full pt-8">
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">Your Playlist</h2>
            <p className="text-sm text-gray-400 mt-1">Stage 6 - Final Celebration</p>
          </div>
          <div className="flex items-center gap-3">
            {onAddLocalTrack && (
              <>
                <input 
                  type="file" 
                  accept="audio/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={onAddLocalTrack} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 rounded-full transition-colors border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.15)] text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Local Track</span>
                </button>
              </>
            )}
            <button 
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-white/20 rounded-full transition-colors border border-white/10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-10">
          {playlist.map((track, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className={`flex items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl transition-all cursor-pointer ${
                currentTrackIndex === i 
                  ? 'bg-gradient-to-r from-white/10 to-transparent border border-white/10 shadow-lg' 
                  : 'hover:bg-white/5'
              }`}
              onClick={() => onSelectTrack(i)}
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-md shrink-0">
                <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                {currentTrackIndex === i && isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1">
                    <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-pink-400 rounded-full" />
                    <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-pink-400 rounded-full" />
                    <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-pink-400 rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className={`text-base sm:text-lg font-semibold truncate ${currentTrackIndex === i ? 'text-pink-300' : 'text-white'}`}>
                  {track.title}
                </h3>
                <p className="text-sm text-gray-400 truncate mt-0.5">{track.artist}</p>
              </div>
              <div className="shrink-0 text-white/50">
                {currentTrackIndex === i ? (
                   <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                     <Play className="w-4 h-4 text-pink-400 fill-current ml-0.5" />
                   </div>
                ) : (
                  <MoreHorizontal className="w-5 h-5" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
