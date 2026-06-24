import { useEffect, useRef, useState, MouseEvent, TouchEvent } from 'react';
import { soundSynth } from './SoundSynthesizer';

interface ScratchLayerProps {
  foilType: 'gold' | 'silver' | 'rose-gold' | 'emerald';
  brushSize?: number;
  onScratchProgress: (percent: number) => void;
  onScratchMove?: (x: number, y: number) => void;
  isRevealed: boolean;
  onRevealTriggered: () => void;
  className?: string;
}

export const ScratchLayer = ({
  foilType,
  brushSize = 45,
  onScratchProgress,
  onScratchMove,
  isRevealed,
  onRevealTriggered,
  className
}: ScratchLayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const [initComplete, setInitComplete] = useState(false);

  // Setup the metallic texture on canvas initialization or change of foilType
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    contextRef.current = ctx;

    const resizeAndPaint = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      paintFoilTexture(ctx, rect.width, rect.height);
      setInitComplete(true);
    };

    resizeAndPaint();

    const resizeObserver = new ResizeObserver(() => {
      // Avoid clearing if already revealed to prevent flickering
      if (!isRevealed) {
        resizeAndPaint();
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, [foilType]);

  // Handle immediate canvas clear when isRevealed transitions to true
  useEffect(() => {
    if (!canvasRef.current || !contextRef.current) return;
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    
    if (isRevealed) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      paintFoilTexture(ctx, canvas.width, canvas.height);
    }
  }, [isRevealed, foilType]);

  // Procedural foil painting helper
  const paintFoilTexture = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    
    // 1. Create luxurious multi-stop linear metallic gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    if (foilType === 'gold') {
      grad.addColorStop(0.0, '#a17420');
      grad.addColorStop(0.15, '#e0b845');
      grad.addColorStop(0.3, '#f5e5a3');
      grad.addColorStop(0.45, '#c39738');
      grad.addColorStop(0.6, '#f9e8ab');
      grad.addColorStop(0.8, '#b58a2c');
      grad.addColorStop(1.0, '#e5be4f');
    } else if (foilType === 'silver') {
      grad.addColorStop(0.0, '#7f8c8d');
      grad.addColorStop(0.2, '#bdc3c7');
      grad.addColorStop(0.4, '#ecf0f1');
      grad.addColorStop(0.6, '#95a5a6');
      grad.addColorStop(0.8, '#dfe4ea');
      grad.addColorStop(1.0, '#747d8c');
    } else if (foilType === 'rose-gold') {
      grad.addColorStop(0.0, '#b33939');
      grad.addColorStop(0.25, '#ff7979');
      grad.addColorStop(0.5, '#ffb8b8');
      grad.addColorStop(0.7, '#cd6133');
      grad.addColorStop(0.85, '#ffb8b8');
      grad.addColorStop(1.0, '#9c3434');
    } else if (foilType === 'emerald') {
      grad.addColorStop(0.0, '#0f3d2b');
      grad.addColorStop(0.2, '#1b8a5a');
      grad.addColorStop(0.4, '#a7f3d0');
      grad.addColorStop(0.6, '#10b981');
      grad.addColorStop(0.8, '#34d399');
      grad.addColorStop(1.0, '#064e3b');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Overlay a realistic grain texture to mimic raw card material brushing
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < w; i += 2) {
      if (Math.random() > 0.4) {
        ctx.fillRect(i, 0, 1, h);
      }
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    for (let i = 0; i < h; i += 2) {
      if (Math.random() > 0.5) {
        ctx.fillRect(0, i, w, 1);
      }
    }

    // 3. Render delicate foil circular sparkles (noise)
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      const size = Math.random() * 1.2;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(rx, ry, size, size);
    }

    // 4. Render an elegant double-layered gold embossed framing border
    ctx.strokeStyle = foilType === 'gold' ? '#fff4cc' : foilType === 'silver' ? '#ffffff' : foilType === 'rose-gold' ? '#ffe4e4' : '#d1fae5';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1.0;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // 5. Draw decorative golden corners
    ctx.fillStyle = ctx.strokeStyle;
    const cornerSize = 10;
    // Top Left
    ctx.fillRect(12, 12, cornerSize, 3);
    ctx.fillRect(12, 12, 3, cornerSize);
    // Top Right
    ctx.fillRect(w - 12 - cornerSize, 12, cornerSize, 3);
    ctx.fillRect(w - 12, 12, 3, cornerSize);
    // Bottom Left
    ctx.fillRect(12, h - 12 - 3, cornerSize, 3);
    ctx.fillRect(12, h - 12 - cornerSize, 3, cornerSize);
    // Bottom Right
    ctx.fillRect(w - 12 - cornerSize, h - 12 - 3, cornerSize, 3);
    ctx.fillRect(w - 12, h - 12 - cornerSize, 3, cornerSize);

    // 6. Draw central instructional typography elegantly embossed
    ctx.font = '500 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Emboss shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillText('✨ GENTLY SCRATCH CARD ✨', w / 2, h / 2 + 1);
    
    // Emboss text highlight
    ctx.fillStyle = foilType === 'gold' ? '#fff2cc' : foilType === 'silver' ? '#ffffff' : foilType === 'rose-gold' ? '#fff5f5' : '#e6fffa';
    ctx.fillText('✨ GENTLY SCRATCH CARD ✨', w / 2, h / 2);

    // Add romantic tiny heart icon at bottom center
    ctx.font = '12px system-ui';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillText('❤️ With Love', w / 2, h / 2 + 41);
    ctx.fillStyle = foilType === 'gold' ? '#ffe6e6' : '#ffffff';
    ctx.fillText('❤️ With Love', w / 2, h / 2 + 40);

    ctx.restore();
  };

  // Get mouse/touch coordinates relative to the canvas bounding box
  const getCoordinates = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startScratching = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    
    isDrawingRef.current = true;
    const pos = getCoordinates(e);
    if (pos) {
      lastPosRef.current = pos;
      scratch(pos.x, pos.y);
    }
  };

  const handleScratching = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || isRevealed) return;
    
    // Prevent default touch gestures to allow smooth mobile scrolling override
    if (e.cancelable) {
      e.preventDefault();
    }

    const pos = getCoordinates(e);
    if (pos && lastPosRef.current) {
      scratch(pos.x, pos.y, lastPosRef.current.x, lastPosRef.current.y);
      lastPosRef.current = pos;
    }
  };

  const stopScratching = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPosRef.current = null;
      checkScratchPercentage();
    }
  };

  // Scrape off coating on brush paths
  const scratch = (x: number, y: number, startX?: number, startY?: number) => {
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';

    ctx.beginPath();
    if (startX !== undefined && startY !== undefined) {
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
    } else {
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();

    // Trigger synthetic crystalline sound feedback based on movement speed
    const velocity = startX !== undefined && startY !== undefined
      ? Math.min(1.0, Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2)) / 30)
      : 0.3;
    
    soundSynth.playScratchSound(0.2 + velocity * 0.8);

    // Call callback to trigger sparkly dust emission
    if (onScratchMove) {
      onScratchMove(x, y);
    }
  };

  // Calculations of revealed surface area to auto-reveal when sufficient
  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let totalPixels = data.length / 4;
      let transparentPixels = 0;

      // Sample every 4th pixel to keep performance high and prevent UI stutter on mobile
      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) {
          transparentPixels++;
        }
      }

      const ratio = transparentPixels / (totalPixels / 4);
      onScratchProgress(ratio);

      // Auto reveal at 42% scratched area to prevent frustration
      if (ratio >= 0.42) {
        onRevealTriggered();
      }
    } catch (err) {
      console.error("Error reading canvas image data:", err);
    }
  };

  return (
    <div className={`absolute inset-0 select-none overflow-hidden rounded-2xl z-20 pointer-events-none ${className || ''}`} id="scratch-canvas-container">
      <canvas
        ref={canvasRef}
        className={`w-full h-full cursor-pointer transition-opacity duration-700 ${
          isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
        onMouseDown={startScratching}
        onMouseMove={handleScratching}
        onMouseUp={stopScratching}
        onMouseLeave={stopScratching}
        onTouchStart={startScratching}
        onTouchMove={handleScratching}
        onTouchEnd={stopScratching}
        id="scratch-foil-canvas"
      />
    </div>
  );
};
