import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const GRID_SIZE = 3;
const NUM_TILES = GRID_SIZE * GRID_SIZE;

// A simple utility to shuffle an array
const shuffle = (array: number[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Check if the puzzle is solvable
const isSolvable = (puzzle: number[]) => {
  let inversions = 0;
  for (let i = 0; i < puzzle.length - 1; i++) {
    for (let j = i + 1; j < puzzle.length; j++) {
      if (puzzle[i] !== NUM_TILES - 1 && puzzle[j] !== NUM_TILES - 1 && puzzle[i] > puzzle[j]) {
        inversions++;
      }
    }
  }
  return inversions % 2 === 0;
};

export default function Stage6({ onBack, onNext }: { onBack?: () => void, onNext?: () => void }) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [imageUrl, setImageUrl] = useState("/puzzle-photo.jpg"); 
  const [imageError, setImageError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);

  const initializePuzzle = () => {
    let newTiles = Array.from({ length: NUM_TILES }, (_, i) => i);
    do {
      newTiles = [...shuffle([...newTiles])];
    } while (!isSolvable(newTiles) || newTiles.every((val, index) => val === index));
    
    setTiles(newTiles);
    setIsSolved(false);
    setHasStarted(true);
  };

  // Pre-load image to check if local puzzle-photo.jpg exists in assets or public
  useEffect(() => {
    const assetsUrl = new URL('../assets/puzzle-photo.jpg', import.meta.url).href;
    const img = new Image();
    
    img.onload = () => {
      setImageUrl(assetsUrl);
      setImageError(false);
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.onerror = () => {
      // Try public folder
      const publicImg = new Image();
      publicImg.onload = () => {
        setImageUrl("/puzzle-photo.jpg");
        setImageError(false);
        if (publicImg.naturalWidth && publicImg.naturalHeight) {
          setAspectRatio(publicImg.naturalWidth / publicImg.naturalHeight);
        }
      };
      publicImg.onerror = () => {
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setImageUrl(fallbackImg.src);
          setImageError(true);
          if (fallbackImg.naturalWidth && fallbackImg.naturalHeight) {
            setAspectRatio(fallbackImg.naturalWidth / fallbackImg.naturalHeight);
          }
        };
        fallbackImg.src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop";
      };
      publicImg.src = "/puzzle-photo.jpg";
    };
    img.src = assetsUrl;
    
    // Start solved initially to show the picture
    setTiles(Array.from({ length: NUM_TILES }, (_, i) => i));
  }, []);

  const triggerConfetti = () => {
    const end = Date.now() + 4 * 1000;
    const colors = ['#e91e63', '#fce4ec', '#f43f5e', '#fb7185', '#ffffff', '#fcd34d'];

    (function frame() {
      // Launch from left bottom
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 },
        colors: colors,
        startVelocity: 60,
        zIndex: 200
      });
      // Launch from right bottom
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 },
        colors: colors,
        startVelocity: 60,
        zIndex: 200
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleTileClick = (index: number) => {
    if (isSolved || !hasStarted) return;

    const emptyIndex = tiles.indexOf(NUM_TILES - 1);
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);

      if (newTiles.every((val, i) => val === i)) {
        setIsSolved(true);
        triggerConfetti();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-[#8a0f2b] to-rose-950 p-4 py-12 pb-32 font-sans relative overflow-y-auto overflow-x-hidden w-full h-full">
      {/* Cinematic Ethereal Glows */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3], rotate: [0, 45, 0] }} 
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-red-600 mix-blend-screen filter blur-[100px]" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2], rotate: [0, -45, 0] }} 
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-rose-500 mix-blend-screen filter blur-[120px]" 
      />

      {/* Golden Sprinkles */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`sprinkle-${i}`}
          animate={{
            y: [0, Math.random() * -15 - 5, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, Math.random() * 0.5 + 0.8, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 bg-yellow-100 rounded-full shadow-[0_0_2px_rgba(253,224,71,0.3)]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="absolute top-6 left-6 md:top-10 md:left-10 z-[120] px-4 py-2 bg-white/60 backdrop-blur-md text-rose-600 rounded-full shadow-md hover:bg-white/80 transition-all font-medium flex items-center gap-2"
        >
          ← Back
        </motion.button>
      )}
      
      <div className="z-10 flex flex-col items-center max-w-md w-full relative">
        <h2 className="text-3xl md:text-5xl font-cursive font-bold text-white mb-6 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {!hasStarted ? "Solve this puzzle for a surprise! ✨" : isSolved ? "You completed my heart! 💖" : "Put the pieces back together 🧩"}
        </h2>

        <div 
          className="relative bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] w-full border border-white/20"
          style={{ 
            maxWidth: '380px',
            maxHeight: '55vh',
            aspectRatio: aspectRatio
          }}
        >
          <div 
            className="w-full h-full grid gap-[2px] relative bg-black/20 rounded-xl overflow-hidden shadow-inner flex-shrink-0"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
            }}
          >
            {tiles.map((tile, index) => {
              const isLastTile = tile === NUM_TILES - 1;
              const isEmptyAndNotSolved = isLastTile && !isSolved && hasStarted;
              
              // Calculate background position based on the original tile index
              const row = Math.floor(tile / GRID_SIZE);
              const col = tile % GRID_SIZE;
              
              return (
                <motion.div
                  key={tile}
                  layout
                  initial={false}
                  animate={{ scale: isEmptyAndNotSolved ? 0.9 : 1, opacity: isEmptyAndNotSolved ? 0 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onClick={() => handleTileClick(index)}
                  className={`w-full h-full relative ${
                    isLastTile && !isSolved ? "cursor-default" : "cursor-pointer"
                  } ${(isSolved || !hasStarted) ? 'rounded-none border-0' : 'rounded-[4px] overflow-hidden bg-white/50 shadow-sm border border-white/30 hover:border-white/80 hover:shadow-md transition-shadow'}`}
                >
                  <div 
                    className="absolute inset-[1px]"
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                      backgroundPosition: `${(col / (GRID_SIZE - 1)) * 100}% ${(row / (GRID_SIZE - 1)) * 100}%`,
                      opacity: isEmptyAndNotSolved ? 0 : 1,
                    }}
                  />
                  {(!isSolved && hasStarted && !isLastTile) && (
                    <div className="absolute inset-0 border border-black/5" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          {!hasStarted ? (
            <button
              onClick={initializePuzzle}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-red-950 font-bold rounded-full shadow-[0_0_15px_rgba(253,224,71,0.5)] hover:shadow-[0_0_25px_rgba(253,224,71,0.7)] transition-all transform hover:-translate-y-1"
            >
              Start Puzzle
            </button>
          ) : (
            <div className="flex flex-col items-center gap-6">
              {!isSolved ? (
                <button
                  onClick={initializePuzzle}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full shadow transition-all border border-white/40"
                >
                  Shuffle Again
                </button>
              ) : (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Heart className="w-16 h-16 text-yellow-300 fill-yellow-300 animate-pulse drop-shadow-[0_0_15px_rgba(253,224,71,0.6)]" />
                  <p className="text-xl md:text-2xl font-cursive font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-center">
                    Every piece of my heart belongs to you!
                  </p>
                </motion.div>
              )}
              
              {onNext && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNext}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] transition-all flex items-center gap-2"
                >
                  Ready for Music 🎶
                </motion.button>
              )}
            </div>
          )}

          {imageError && (
            <div className="mt-8 p-4 bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 text-center text-sm text-white max-w-sm w-full mx-auto shadow-lg">
                <span className="opacity-80 text-yellow-200">Want to use your own photo instead?</span><br/>
                Upload <b className="text-white bg-white/20 px-1 rounded">puzzle-photo.jpg</b> to src/assets/ or public/ folder!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
