import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  isPlaying: boolean;
}

export function AudioVisualizer({ analyserRef, isPlaying }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const analyser = analyserRef.current;
      let timeData = new Uint8Array(analyser ? analyser.frequencyBinCount : 0);
      let freqData = new Uint8Array(analyser ? analyser.frequencyBinCount : 0);
      let hasAudio = false;

      let bass = 0;
      let mid = 0;
      let high = 0;

      if (analyser && isPlaying) {
        analyser.getByteTimeDomainData(timeData);
        analyser.getByteFrequencyData(freqData);
        hasAudio = true;

        const bassRange = freqData.slice(0, 10);
        const midRange = freqData.slice(10, 100);
        const highRange = freqData.slice(100, 250);

        bass = bassRange.reduce((a, b) => a + b, 0) / bassRange.length / 255;
        mid = midRange.reduce((a, b) => a + b, 0) / midRange.length / 255;
        high = highRange.reduce((a, b) => a + b, 0) / highRange.length / 255;
      }

      const strings = [
        { color: 'rgba(236, 72, 153, 0.90)', freq: 0.003 + (mid * 0.005), speed: 0.02 + (bass * 0.04), ampMult: 1.2 + (bass * 1.5), offset: 0, shadowBlur: hasAudio ? 18 + (high * 22) : 6, centerYRatio: 0.15 },
        { color: 'rgba(168, 85, 247, 0.80)', freq: 0.004 + (mid * 0.005), speed: 0.015 + (bass * 0.04), ampMult: 1.0 + (bass * 1.2), offset: 3, shadowBlur: hasAudio ? 18 + (high * 22) : 6, centerYRatio: 0.16 },
        { color: 'rgba(34, 211, 238, 0.75)', freq: 0.005 + (mid * 0.005), speed: 0.025 + (bass * 0.04), ampMult: 1.4 + (bass * 1.8), offset: 6, shadowBlur: hasAudio ? 18 + (high * 22) : 6, centerYRatio: 0.17 },
        { color: 'rgba(217, 70, 239, 0.65)', freq: 0.0035 + (mid * 0.005), speed: 0.018 + (bass * 0.04), ampMult: 0.8 + (bass * 1.0), offset: 9, shadowBlur: hasAudio ? 18 + (high * 22) : 6, centerYRatio: 0.18 },
      ];

      strings.forEach((str) => {
        ctx.beginPath();
        const centerY = canvas.height * str.centerYRatio;
        ctx.moveTo(0, centerY);
        
        for (let x = 0; x <= canvas.width; x += 4) {
          const envelope = Math.sin((x / canvas.width) * Math.PI);
          
          let audioDisplacement = 0;
          if (hasAudio) {
            const dataIndex = Math.floor((x / canvas.width) * timeData.length);
            const waveform = (timeData[dataIndex] - 128) / 128;
            audioDisplacement = waveform * 45 * str.ampMult * envelope;
            
            if (high > 0.1 && Math.random() > 0.95) {
              audioDisplacement += (Math.random() - 0.5) * (high * 20);
            }
          }

          const baseWave = Math.sin(x * str.freq + phase * str.speed + str.offset) * (6 + (mid * 12)) * envelope;
          const y = centerY + baseWave + audioDisplacement;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = str.color;
        ctx.lineWidth = 2.5 + (high * 2.5);
        ctx.shadowBlur = str.shadowBlur;
        ctx.shadowColor = str.color;
        ctx.stroke();
      });

      phase += hasAudio ? 1.2 + (mid * 1.2) : 0.6;
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, analyserRef]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover opacity-85"
      />
    </div>
  );
}
