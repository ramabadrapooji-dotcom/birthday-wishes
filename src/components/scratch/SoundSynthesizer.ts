// Simple Web Audio API Synthesizer for high-fidelity sound effects and ambient pad
class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Plays a delicate, metallic chime/scrape sound for scratch feedback
  public playScratchSound(velocity: number = 0.5) {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Scrape noise bandpass
    const bufferSize = this.ctx.sampleRate * 0.05; // 50ms buffer
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4000 + Math.random() * 3000, now);
    filter.Q.setValueAtTime(3.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    // High starry chime
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    // Random crystalline frequency
    const freq = 1500 + Math.random() * 2000;
    osc.frequency.setValueAtTime(freq, now);
    
    oscGain.gain.setValueAtTime(velocity * 0.08, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    // Connect and start
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.05);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Plays a cinematic, emotional chord progression and sparkle arpeggio on reveal
  public playRevealSound() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Harmonious major chord notes (Ab major / Db major)
    const baseFreqs = [110, 165, 220, 275, 330, 440, 550, 660]; // Rich frequencies
    
    // Cinematic warm synthesizer swell
    baseFreqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.02);

      // Warm lowpass filter to make it sound premium and lush
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(100, now);
      lowpass.frequency.exponentialRampToValueAtTime(1200, now + 0.8);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.4 + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0 + idx * 0.1);

      osc.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.02);
      osc.stop(now + 2.5);
    });

    // Starry sparkles arpeggio
    const sparkles = [880, 1100, 1320, 1760, 2200, 2640];
    sparkles.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.3 + idx * 0.08);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.3 + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + idx * 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + 0.3 + idx * 0.08);
      osc.stop(now + 1.2);
    });
  }

  // Plays soft, relaxing romantic lofi pad music
  public startAmbientMusic() {
    this.init();
    if (!this.ctx || this.isAmbientPlaying) return;

    try {
      this.isAmbientPlaying = true;
      const now = this.ctx.currentTime;

      // Base volume control
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.12, now + 2.0); // Fade in
      this.ambientGain.connect(this.ctx.destination);

      // Generate soft, sliding root pads
      const chords = [
        [130.81, 196.00, 261.63, 329.63], // C major 7 (C3, G3, C4, E4)
        [138.59, 207.65, 277.18, 349.23], // Db major 7
        [146.83, 220.00, 293.66, 369.99], // D major 7
        [130.81, 196.00, 261.63, 329.63], // C major 7
      ];

      let chordIndex = 0;

      const scheduleNextChord = () => {
        if (!this.isAmbientPlaying || !this.ctx || !this.ambientGain) return;
        const currentChord = chords[chordIndex];
        const chordTime = this.ctx.currentTime;
        const duration = 6.0; // Seconds per chord

        currentChord.forEach((freq) => {
          if (!this.ctx || !this.ambientGain) return;
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, chordTime);
          
          // Subtle pitch vibrato for romantic vinyl flutter
          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();
          lfo.frequency.setValueAtTime(4.5 + Math.random(), chordTime); // Vinyl wobble speed
          lfoGain.gain.setValueAtTime(0.3, chordTime); // Depth

          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);

          oscGain.gain.setValueAtTime(0, chordTime);
          oscGain.gain.linearRampToValueAtTime(0.04, chordTime + 1.5);
          oscGain.gain.setValueAtTime(0.04, chordTime + duration - 1.5);
          oscGain.gain.linearRampToValueAtTime(0, chordTime + duration);

          osc.connect(oscGain);
          oscGain.connect(this.ambientGain!);

          lfo.start(chordTime);
          osc.start(chordTime);

          lfo.stop(chordTime + duration);
          osc.stop(chordTime + duration);
        });

        chordIndex = (chordIndex + 1) % chords.length;
        
        // Loop continuously using timeout
        setTimeout(() => {
          if (this.isAmbientPlaying) {
            scheduleNextChord();
          }
        }, (duration - 0.1) * 1000);
      };

      scheduleNextChord();
    } catch (e) {
      console.error('Failed to start ambient synthesizer music:', e);
    }
  }

  public stopAmbientMusic() {
    if (!this.ctx || !this.ambientGain) return;
    const now = this.ctx.currentTime;
    try {
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(0, now + 1.0); // Fade out
      setTimeout(() => {
        this.isAmbientPlaying = false;
        this.ambientOscs = [];
      }, 1100);
    } catch (e) {
      this.isAmbientPlaying = false;
    }
  }
}

export const soundSynth = new SoundSynthesizer();
