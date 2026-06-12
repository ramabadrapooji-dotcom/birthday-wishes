import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 30;

class HeartParticle {
  x = 0;
  y = 0;
  size = 0;
  speed = 0;
  opacity = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = this.canvas.height + 20;
    this.size = Math.random() * 15 + 5;
    this.speed = Math.random() * 0.5 + 0.2;
    this.opacity = Math.random() * 0.3 + 0.1;
  }

  update() {
    this.y -= this.speed;
    this.x += Math.sin(this.y * 0.01) * 0.5;
    if (this.y < -20) this.reset();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(150, 53, 70, ${this.opacity})`;
    ctx.font = `${this.size}px serif`;
    ctx.fillText('❤', this.x, this.y);
  }
}

export const HeartParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement!);

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new HeartParticle(canvas));
    let frameId = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="vintage-bg-canvas" aria-hidden="true" />;
};
