/**
 * Civil Defense Disaster Warning Siren Synthesizer using Web Audio API.
 * Synthesizes realistic alternating emergency siren tones without needing external audio files.
 */

class SirenEngine {
  private audioCtx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.5;

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public startSiren() {
    if (this.isPlaying) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // Master Gain
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.01, now);
      this.gainNode.gain.exponentialRampToValueAtTime(this.volume * 0.4, now + 0.5);

      // Low Frequency Oscillator (LFO) for warning wail (0.4 Hz cycle: up and down)
      this.lfoNode = this.audioCtx.createOscillator();
      this.lfoNode.type = 'triangle';
      this.lfoNode.frequency.setValueAtTime(0.35, now); // ~3 seconds per sweep

      this.lfoGain = this.audioCtx.createGain();
      this.lfoGain.gain.setValueAtTime(220, now); // Frequency deviation +/- 220 Hz

      this.lfoNode.connect(this.lfoGain);

      // Primary Oscillator (Center frequency around 680 Hz - classic disaster alert)
      this.osc1 = this.audioCtx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(680, now);
      this.lfoGain.connect(this.osc1.frequency);

      // Secondary harmonic Oscillator (tuned a fifth up ~ 1020 Hz for acoustic pierce)
      this.osc2 = this.audioCtx.createOscillator();
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(1020, now);
      this.lfoGain.connect(this.osc2.frequency);

      // Connect to output
      this.osc1.connect(this.gainNode);
      this.osc2.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.lfoNode.start(now);
      this.osc1.start(now);
      this.osc2.start(now);

      this.isPlaying = true;
    } catch (err) {
      console.warn('Web Audio Siren could not be started:', err);
    }
  }

  public stopSiren() {
    if (!this.isPlaying || !this.gainNode || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      setTimeout(() => {
        try {
          this.osc1?.stop();
          this.osc2?.stop();
          this.lfoNode?.stop();
          this.osc1?.disconnect();
          this.osc2?.disconnect();
          this.lfoNode?.disconnect();
          this.gainNode?.disconnect();
        } catch {
          // cleanup
        }
        this.osc1 = null;
        this.osc2 = null;
        this.lfoNode = null;
        this.lfoGain = null;
        this.gainNode = null;
        this.isPlaying = false;
      }, 350);
    } catch (err) {
      console.warn('Error stopping siren:', err);
      this.isPlaying = false;
    }
  }

  public playTestBeep() {
    try {
      this.initContext();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);

      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (err) {
      console.warn('Error playing test beep:', err);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioCtx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const sirenManager = new SirenEngine();
