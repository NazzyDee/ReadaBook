export interface AudioStemTrack {
  id: string;
  name: string;
  characterRole: string;
  avatarUrl: string;
  volume: number;
  isMuted: boolean;
  isSolo: boolean;
  pan: number; // -50 (L) to +50 (R)
  noiseGateDb: number;
  peakLevel: number;
  waveform: number[];
}

export const INITIAL_AUDIO_STEMS: AudioStemTrack[] = [
  {
    id: 'stem_host',
    name: 'SarahBooks (Host)',
    characterRole: 'Narrator & Prose',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    volume: 90,
    isMuted: false,
    isSolo: false,
    pan: 0,
    noiseGateDb: -45,
    peakLevel: 78,
    waveform: [40, 65, 80, 55, 70, 90, 85, 60, 45, 75, 88, 62, 50, 80, 95, 70, 40]
  },
  {
    id: 'stem_guest_1',
    name: 'LordOfVoices',
    characterRole: 'Gandalf the Grey',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    volume: 95,
    isMuted: false,
    isSolo: false,
    pan: -15,
    noiseGateDb: -40,
    peakLevel: 85,
    waveform: [30, 50, 75, 90, 85, 60, 70, 95, 100, 80, 65, 90, 75, 55, 85, 90, 50]
  },
  {
    id: 'stem_guest_2',
    name: 'ElijahReads',
    characterRole: 'Frodo Baggins',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    volume: 88,
    isMuted: false,
    isSolo: false,
    pan: 15,
    noiseGateDb: -42,
    peakLevel: 72,
    waveform: [25, 45, 60, 70, 65, 55, 80, 75, 60, 70, 85, 60, 45, 65, 70, 60, 35]
  },
  {
    id: 'stem_foley',
    name: 'Foley FX & Ambience',
    characterRole: 'Rain, Fireplace & Harp',
    avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
    volume: 45,
    isMuted: false,
    isSolo: false,
    pan: 0,
    noiseGateDb: -60,
    peakLevel: 42,
    waveform: [20, 30, 35, 40, 38, 42, 45, 40, 35, 42, 40, 38, 30, 35, 42, 38, 25]
  }
];
