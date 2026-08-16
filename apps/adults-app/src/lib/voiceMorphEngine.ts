export interface VoiceProfile {
  id: string;
  name: string;
  characterType: string;
  icon: string;
  pitchSemitones: number; // -12 to +12
  filterFreq: number; // Hz
  filterType: BiquadFilterType;
  reverbAmount: number; // 0 to 1
  description: string;
}

export const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'natural',
    name: 'Natural Narrator',
    characterType: 'Host / Storyteller',
    icon: '🎙️',
    pitchSemitones: 0,
    filterFreq: 12000,
    filterType: 'lowpass',
    reverbAmount: 0.05,
    description: 'Clean studio broadcast compression with warm vocal tone.'
  },
  {
    id: 'wizard',
    name: 'Archmage Wizard',
    characterType: 'Elderly / Mage',
    icon: '🧙',
    pitchSemitones: -3,
    filterFreq: 2200,
    filterType: 'lowpass',
    reverbAmount: 0.45,
    description: 'Deep resonant chest resonance with mystical cathedral echo.'
  },
  {
    id: 'dragon',
    name: 'Ancient Dragon',
    characterType: 'Monstrous / Beast',
    icon: '🐉',
    pitchSemitones: -6,
    filterFreq: 800,
    filterType: 'lowpass',
    reverbAmount: 0.6,
    description: 'Sub-bass gravel rumble and volcanic cavern acoustic reflection.'
  },
  {
    id: 'elf',
    name: 'Elven High Maiden',
    characterType: 'Ethereal / Royalty',
    icon: '🧝',
    pitchSemitones: 2,
    filterFreq: 4500,
    filterType: 'peaking',
    reverbAmount: 0.4,
    description: 'Silvery shimmering highs with celestial plate reverberation.'
  },
  {
    id: 'goblin',
    name: 'Gnomish Tinkerer',
    characterType: 'Creature / Comic',
    icon: '🤖',
    pitchSemitones: 5,
    filterFreq: 1800,
    filterType: 'bandpass',
    reverbAmount: 0.1,
    description: 'High-pitched nasal formant shift with brisk articulation.'
  }
];

class VoiceMorphEngine {
  private ctx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private isEnabled = false;
  private currentProfile: VoiceProfile = VOICE_PROFILES[0];
  private listeners: ((profile: VoiceProfile, isEnabled: boolean) => void)[] = [];

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: (profile: VoiceProfile, isEnabled: boolean) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  public async startMic(): Promise<boolean> {
    try {
      this.initCtx();
      if (!this.micStream) {
        this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      }

      if (!this.sourceNode && this.ctx && this.micStream) {
        this.sourceNode = this.ctx.createMediaStreamSource(this.micStream);
        this.filterNode = this.ctx.createBiquadFilter();
        this.gainNode = this.ctx.createGain();

        this.applyProfileToNodes(this.currentProfile);

        this.sourceNode.connect(this.filterNode);
        this.filterNode.connect(this.gainNode);
        // Note: For headphone monitoring, gain connects to destination
      }

      this.isEnabled = true;
      this.notify();
      return true;
    } catch (e) {
      console.warn('Microphone access denied or unavailable for voice morphing', e);
      return false;
    }
  }

  public stopMic() {
    this.isEnabled = false;
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    this.sourceNode = null;
    this.notify();
  }

  public setProfile(profile: VoiceProfile) {
    this.currentProfile = profile;
    this.applyProfileToNodes(profile);
    this.notify();
  }

  public getProfile(): VoiceProfile {
    return this.currentProfile;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  private applyProfileToNodes(profile: VoiceProfile) {
    if (this.filterNode && this.ctx) {
      this.filterNode.type = profile.filterType;
      this.filterNode.frequency.setTargetAtTime(profile.filterFreq, this.ctx.currentTime, 0.05);
    }
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.currentProfile, this.isEnabled));
  }
}

export const voiceMorph = new VoiceMorphEngine();
