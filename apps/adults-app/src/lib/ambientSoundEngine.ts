// Web Audio API Procedural Ambient Sound Generator
class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private noiseNodes: Record<string, { gain: GainNode; isPlaying: boolean }> = {};

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create White/Pink Noise Buffer for Rain, Fire, Waves, etc.
  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) this.initCtx();
    const bufferSize = this.ctx!.sampleRate * 2;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  public setSoundVolume(soundId: string, volume: number) { // volume 0 to 1
    this.initCtx();
    if (!this.ctx) return;

    if (volume <= 0) {
      if (this.noiseNodes[soundId]) {
        this.noiseNodes[soundId].gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
        this.noiseNodes[soundId].isPlaying = false;
      }
      return;
    }

    if (!this.noiseNodes[soundId]) {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.createNoiseBuffer();
      noiseSource.loop = true;

      // Filter based on sound type
      const filter = this.ctx.createBiquadFilter();
      if (soundId === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 900;
      } else if (soundId === 'fire') {
        filter.type = 'bandpass';
        filter.frequency.value = 650;
        filter.Q.value = 2.0;
      } else if (soundId === 'waves') {
        filter.type = 'lowpass';
        filter.frequency.value = 400;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
      }

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noiseSource.start();

      this.noiseNodes[soundId] = { gain, isPlaying: true };
    }

    this.noiseNodes[soundId].gain.gain.setTargetAtTime(volume * 0.25, this.ctx.currentTime, 0.1);
    this.noiseNodes[soundId].isPlaying = true;
  }

  public stopAll() {
    if (!this.ctx) return;
    Object.values(this.noiseNodes).forEach(node => {
      node.gain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.1);
      node.isPlaying = false;
    });
  }
}

export const ambientEngine = new AmbientSoundEngine();
