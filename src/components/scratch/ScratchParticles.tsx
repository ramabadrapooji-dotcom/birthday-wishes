import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Particle } from './types';

export interface ScratchParticlesRef {
  emitScratch: (x: number, y: number, color: string, foilType: 'gold' | 'silver' | 'rose-gold' | 'emerald') => void;
  emitReveal: (width: number, height: number, colors: string[]) => void;
  clear: () => void;
}

interface ScratchParticlesProps {
  className?: string;
}

export const ScratchParticles = forwardRef<ScratchParticlesRef, ScratchParticlesProps>(
  ({ className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    // Expose particle emission functions to parent components
    useImperativeHandle(ref, () => ({
      emitScratch: (x, y, color, foilType) => {
        const count = 5 + Math.floor(Math.random() * 6); // Emit 5-10 particles per scratch movement
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 3.5;
          const life = 20 + Math.random() * 25;
          
          // Decide shape
          let shape: 'star' | 'circle' | 'heart' | 'foil' = 'foil';
          const r = Math.random();
          if (r < 0.25) shape = 'star';
          else if (r < 0.4) shape = 'heart';
          else if (r < 0.6) shape = 'circle';

          // Determine foil color shade variations
          let pColor = color;
          if (foilType === 'gold') {
            const goldShades = ['#F59E0B', '#FBBF24', '#FCD34D', '#FFFBEB', '#D97706'];
            pColor = goldShades[Math.floor(Math.random() * goldShades.length)];
          } else if (foilType === 'silver') {
            const silverShades = ['#E5E7EB', '#F3F4F6', '#9CA3AF', '#D1D5DB', '#FFFFFF'];
            pColor = silverShades[Math.floor(Math.random() * silverShades.length)];
          } else if (foilType === 'rose-gold') {
            const roseShades = ['#F472B6', '#FBCFE8', '#FCE7F3', '#FB7185', '#E11D48'];
            pColor = roseShades[Math.floor(Math.random() * roseShades.length)];
          } else if (foilType === 'emerald') {
            const emeraldShades = ['#34D399', '#6EE7B7', '#A7F3D0', '#10B981', '#059669'];
            pColor = emeraldShades[Math.floor(Math.random() * emeraldShades.length)];
          }

          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.5, // Slight upward drift
            size: 1.5 + Math.random() * 3.5,
            color: pColor,
            alpha: 1.0,
            life,
            maxLife: life,
            rotation: Math.random() * Math.PI * 2,
            vRotation: (Math.random() - 0.5) * 0.3,
            shape
          });
        }
      },

      emitReveal: (width, height, colors) => {
        // Grand celebration explosion with lots of hearts, golden star sparks, and floating confetti
        const count = 120 + Math.floor(Math.random() * 40);
        
        // Emit from multiple points or center
        const spawnPoints = [
          { x: width * 0.5, y: height * 0.5 },
          { x: width * 0.3, y: height * 0.4 },
          { x: width * 0.7, y: height * 0.4 },
        ];

        spawnPoints.forEach((point) => {
          for (let i = 0; i < count / 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2.0 + Math.random() * 8.0;
            const life = 50 + Math.random() * 60;
            
            // Choose shape
            let shape: 'star' | 'circle' | 'heart' | 'foil' = 'circle';
            const r = Math.random();
            if (r < 0.4) shape = 'heart';
            else if (r < 0.75) shape = 'star';
            else shape = 'foil';

            particlesRef.current.push({
              x: point.x,
              y: point.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 1.5, // Stronger upward burst
              size: 2.0 + Math.random() * 6.0,
              color: colors[Math.floor(Math.random() * colors.length)],
              alpha: 1.0,
              life,
              maxLife: life,
              rotation: Math.random() * Math.PI * 2,
              vRotation: (Math.random() - 0.5) * 0.2,
              shape
            });
          }
        });

        // Add slow floating background dust that stays longer
        for (let i = 0; i < 30; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: height + 20,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(0.5 + Math.random() * 1.5), // Slow float up
            size: 1.5 + Math.random() * 2.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.1,
            life: 180 + Math.random() * 120,
            maxLife: 240,
            rotation: Math.random() * Math.PI * 2,
            vRotation: (Math.random() - 0.5) * 0.05,
            shape: Math.random() > 0.5 ? 'heart' : 'star'
          });
        }
      },

      clear: () => {
        particlesRef.current = [];
      }
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle high DPI displays for crisp rendering
      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      };

      resizeCanvas();
      
      // Setup a resize observer on parent container for perfect rendering dimensions
      const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      if (canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
      }

      // Main drawing and simulation loop
      const updateAndDraw = () => {
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;

        ctx.clearRect(0, 0, width, height);

        const activeParticles = particlesRef.current;
        for (let i = activeParticles.length - 1; i >= 0; i--) {
          const p = activeParticles[i];
          p.life--;

          if (p.life <= 0) {
            activeParticles.splice(i, 1);
            continue;
          }

          // Apply physics
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.06; // Gravity
          p.vx *= 0.98; // Friction
          p.rotation += p.vRotation;

          // Fade out near end of life
          p.alpha = Math.max(0, p.life / p.maxLife);

          // Draw individual particle with proper rotation and alpha
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;

          if (p.shape === 'star') {
            drawStar(ctx, 0, 0, 5, p.size * 2, p.size);
          } else if (p.shape === 'heart') {
            drawHeart(ctx, 0, 0, p.size * 2);
          } else if (p.shape === 'foil') {
            // Shiny metallic rectangle confetti
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 0.5;
            ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
            ctx.strokeRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
          } else {
            // circle
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        animationFrameRef.current = requestAnimationFrame(updateAndDraw);
      };

      animationFrameRef.current = requestAnimationFrame(updateAndDraw);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        resizeObserver.disconnect();
      };
    }, []);

    // Helper: Draw sparkling star
    const drawStar = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    // Helper: Draw romantic floating heart
    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y + size / 4);
      ctx.quadraticCurveTo(x, y, x + size / 2, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      ctx.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
      ctx.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
      ctx.quadraticCurveTo(x, y, x, y + size / 4);
      ctx.closePath();
      ctx.fill();
    };

    return (
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full pointer-events-none z-30 ${className || ''}`}
        id="scratch-particles-canvas"
      />
    );
  }
);

ScratchParticles.displayName = 'ScratchParticles';
