import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Heart, 
  SkipBack, 
  Play, 
  Pause, 
  SkipForward, 
  Shuffle,
  Repeat
} from 'lucide-react';
import { Track } from './types';
import { AudioVisualizer } from './AudioVisualizer';
import { VinylRoom } from './Stage6/Scene/VinylRoom';
import { Playlist } from './Playlist';
import { VolumeControl } from './VolumeControl';
import { MiniPlayer } from './MiniPlayer';
import { STAGE7_PLAYLIST } from '../../constants';

const getAssetUrl = (filename: string) => {
  try {
    return new URL(`../../assets/${filename}`, import.meta.url).href;
  } catch {
    return `/assets/${filename}`; // fallback if URL throws
  }
};

const DEFAULT_PLAYLIST: Track[] = STAGE7_PLAYLIST.map(song => ({
  title: song.title,
  artist: song.artist,
  url: getAssetUrl(song.filename),
  fallbackUrl: song.fallbackUrl,
  cover: song.cover
}));

const PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  duration: Math.random() * 20 + 10,
  delay: Math.random() * 5,
}));

export function Stage6MusicPlayer({ onBack }: { onBack?: () => void }) {
  const [playlist, setPlaylist] = useState<Track[]>(DEFAULT_PLAYLIST);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  const audioRef = useRef<HTMLAudioElement>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudioAPI = () => {
    try {
      if (!audioCtxRef.current && audioRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512; 
        
        const gainNode = ctx.createGain();
        gainNode.gain.value = 1;

        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        sourceRef.current = source;
        gainNodeRef.current = gainNode;
      }
      
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (e) {
      console.warn("AudioContext creation failed or restricted", e);
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    }
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNext();
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadAudioSource = async () => {
      if (!audioRef.current) return;
      
      try {
        const isBlob = currentTrack.url.startsWith('blob:');
        let finalSrc = currentTrack.url;
        
        if (!isBlob) {
          const res = await fetch(currentTrack.url, { method: 'HEAD' }).catch(() => null);
          if (!isMounted) return;
          
          const contentType = res?.headers.get('content-type');
          const isValidMedia = res?.ok && contentType && (contentType.includes('audio') || contentType.includes('video'));
          
          if (!isValidMedia) {
            finalSrc = currentTrack.fallbackUrl;
          }
        }
        
        if (audioRef.current.src !== finalSrc && !audioRef.current.src.endsWith(finalSrc)) {
           audioRef.current.src = finalSrc;
           audioRef.current.load();
        }
      } catch (e) {
        if (!isMounted) return;
        if (audioRef.current.src !== currentTrack.fallbackUrl) {
           audioRef.current.src = currentTrack.fallbackUrl;
           audioRef.current.load();
        }
      }

      if (isPlaying) {
         audioRef.current.play().catch(e => console.warn("Playback prevented:", e));
      }
    };
    
    loadAudioSource();
    return () => { isMounted = false; };
  }, [currentTrackIndex]); 

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        initAudioAPI();
        if (audioRef.current.src && audioRef.current.src !== window.location.href) {
          audioRef.current.play().catch(e => console.warn("Playback failed", e));
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Preload all playlist tracks in background for instant, gapless transition
  useEffect(() => {
    playlist.forEach(track => {
      if (track.url && !track.url.startsWith('blob:')) {
        const a = new Audio();
        a.src = track.url;
        a.preload = 'auto';
      }
      if (track.fallbackUrl && !track.fallbackUrl.startsWith('blob:')) {
        const a = new Audio();
        a.src = track.fallbackUrl;
        a.preload = 'auto';
      }
    });
  }, [playlist]);

  const togglePlay = () => {
    initAudioAPI();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddLocalTrack = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newTrack: Track = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Local Upload",
        url: url,
        fallbackUrl: url,
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=500&h=500"
      };
      setPlaylist(prev => [...prev, newTrack]);
      setCurrentTrackIndex(playlist.length); // Play the new track
      setIsPlaying(true);
    }
    e.target.value = '';
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative h-[100dvh] w-[100dvw] bg-[#0a0310] text-white overflow-hidden font-sans flex flex-col selection:bg-pink-500/30">
      <audio 
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-900/30 blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/20 blur-[150px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute top-[40%] left-[60%] w-[40%] h-[40%] rounded-full bg-pink-900/20 blur-[100px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bg-white/5 border border-white/5"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size * 2 + 5,
              height: p.size * 2 + 5,
              borderRadius: '2px',
            }}
            animate={{
              y: [-10, -100],
              opacity: [0, 0.35, 0.35, 0],
              rotate: [0, 30, 60],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <MiniPlayer currentTrack={currentTrack} isPlaying={isPlaying} togglePlay={togglePlay} />

      <VinylRoom currentTrack={currentTrack} progressPercent={progressPercent} analyserRef={analyserRef} isPlaying={isPlaying} />

      <AudioVisualizer analyserRef={analyserRef} isPlaying={isPlaying} />

      <div className="relative z-10 flex flex-col h-full w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pt-16 md:pt-6 pointer-events-none">
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-1 lg:mb-6 shrink-0 pointer-events-auto"
        >
          <button 
            onClick={onBack}
            className="p-2 sm:p-3 -ml-2 sm:-ml-3 hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm group"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-gray-200 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-center flex flex-col">
            <span className="text-[10px] text-pink-400 font-bold tracking-[0.2em] uppercase mb-0.5">Chapter VI</span>
            <h1 className="text-xs sm:text-sm font-semibold tracking-widest text-gray-200 uppercase letter-spacing-2">Unforgettable</h1>
          </div>
          <button 
            className="p-2 sm:p-3 -mr-2 sm:-mr-3 hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm"
            onClick={() => setShowPlaylist(true)}
          >
            <MoreHorizontal className="w-6 h-6 sm:w-7 sm:h-7 text-gray-200" />
          </button>
        </motion.header>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0 items-center justify-end gap-2 sm:gap-6 lg:gap-16 w-full mt-1 lg:mt-0 pb-2">
          
          <div className="flex-1 w-full pointer-events-none hidden lg:block" />

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md lg:max-w-md shrink-0 z-20 mt-auto lg:mt-0 pointer-events-auto"
          >
             <div className="backdrop-blur-3xl bg-[#050305]/60 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 w-full shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] relative">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

               <div className="flex justify-between items-end mb-4 sm:mb-6">
                 <div className="overflow-hidden pr-4 flex-1">
                   <motion.h2 
                     key={currentTrack.title}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="text-lg sm:text-2xl font-bold text-white tracking-wide truncate drop-shadow-md"
                   >
                     {currentTrack.title}
                   </motion.h2>
                   <motion.p 
                     key={currentTrack.artist}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.1 }}
                     className="text-pink-300/90 text-xs sm:text-base mt-1 sm:mt-1.5 truncate font-medium"
                   >
                     {currentTrack.artist}
                   </motion.p>
                   <motion.p
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.2 }}
                     className="text-white/50 text-[10px] sm:text-xs mt-1 italic font-light tracking-wide"
                   >
                     "A special song for your special day..."
                   </motion.p>
                 </div>
               </div>
               
               <div className="mb-4 sm:mb-8">
                 <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3 font-mono tracking-wider font-medium">
                   <span>{formatTime(currentTime)}</span>
                   <span>{formatTime(duration)}</span>
                 </div>
                 
                 <div 
                   className="h-1.5 sm:h-2 bg-black/60 rounded-full overflow-hidden cursor-pointer relative shadow-inner group"
                   onClick={handleSeek}
                 >
                   <motion.div 
                     className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-fuchsia-400 to-purple-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,1)] group-hover:brightness-125 transition-all"
                     style={{ width: `${progressPercent}%` }}
                     layout
                     transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                   />
                 </div>
               </div>

               <div className="flex justify-between items-center px-1">
                 <button 
                   onClick={() => setIsFav(!isFav)}
                   className="text-white/80 hover:scale-110 transition-all p-1.5 sm:p-2 group"
                 >
                   <Heart className={`w-5 h-5 sm:w-7 sm:h-7 transition-colors ${isFav ? 'fill-pink-500 text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]' : 'group-hover:text-pink-300'}`} />
                 </button>
                 
                 <button onClick={handlePrev} className="text-white/90 hover:text-pink-400 hover:scale-110 transition-all p-1.5 sm:p-2">
                   <SkipBack className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                 </button>
                 
                 <button 
                   onClick={togglePlay}
                   className="text-white hover:scale-105 hover:text-pink-300 transition-all p-3 sm:p-5 rounded-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                 >
                   {isPlaying ? (
                     <Pause className="w-6 h-6 sm:w-10 sm:h-10 fill-current drop-shadow-md" />
                   ) : (
                     <Play className="w-6 h-6 sm:w-10 sm:h-10 fill-current ml-1 drop-shadow-md" />
                   )}
                 </button>

                 <button onClick={handleNext} className="text-white/90 hover:text-pink-400 hover:scale-110 transition-all p-1.5 sm:p-2">
                   <SkipForward className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                 </button>
                 
                 <VolumeControl gainNodeRef={gainNodeRef} audioCtxRef={audioCtxRef} />
               </div>
             </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showPlaylist && (
          <Playlist 
            playlist={playlist} 
            currentTrackIndex={currentTrackIndex} 
            isPlaying={isPlaying} 
            onClose={() => setShowPlaylist(false)} 
            onSelectTrack={(i) => {
              setCurrentTrackIndex(i);
              setIsPlaying(true);
              setShowPlaylist(false);
            }} 
            onAddLocalTrack={handleAddLocalTrack}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
