export interface AudioStemTrack {
  id: string;
  name: string;
  type: 'vocal' | 'sfx' | 'music' | 'ambience';
  avatarUrl: string;
  characterRole: string;
  peakLevel: number;
  volume: number; // 0 to 100
  isMuted: boolean;
  isSolo: boolean;
  durationFormatted: string;
}

export const INITIAL_AUDIO_STEMS: AudioStemTrack[] = [
  { id: 'stem_vocal', name: 'Lead Narrator Vocal (Clean)', type: 'vocal', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', characterRole: 'Primary Narrator (LillyReads)', peakLevel: 82, volume: 90, isMuted: false, isSolo: false, durationFormatted: '45m 12s' },
  { id: 'stem_foley', name: 'Smart Foley FX (Steps & Rain)', type: 'sfx', avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80', characterRole: 'Atmospheric Environmental FX', peakLevel: 54, volume: 60, isMuted: false, isSolo: false, durationFormatted: '45m 12s' },
  { id: 'stem_music', name: 'Background Fantasy Orchestral Score', type: 'music', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', characterRole: 'Epic Ambient Soundtrack', peakLevel: 68, volume: 40, isMuted: false, isSolo: false, durationFormatted: '45m 12s' },
  { id: 'stem_ambience', name: 'Tavern Fireplace & Wind Ambience', type: 'ambience', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', characterRole: 'Room Resonance & Foley', peakLevel: 35, volume: 30, isMuted: false, isSolo: false, durationFormatted: '45m 12s' }
];

export interface AudioStemPackage {
  id: string;
  title: string;
  narrator: string;
  bookTitle: string;
  genre: string;
  duration: string;
  bpm: string;
  key: string;
  price: number; // 0 for free/pass
  isPassIncluded: boolean;
  coverUrl: string;
  stems: {
    name: string;
    type: 'vocal' | 'foley' | 'music' | 'ambience';
    waveformMock: number[];
  }[];
  tags: string[];
}

export const MOCK_AUDIO_STEMS: AudioStemPackage[] = [
  {
    id: 'stems_fellowship_ch1',
    title: 'The Long-Expected Party (Full Multi-Stem Pack)',
    narrator: 'LillyReads',
    bookTitle: 'The Fellowship of the Ring',
    genre: 'High Fantasy',
    duration: '14m 20s',
    bpm: '78 BPM',
    key: 'D Minor',
    price: 0,
    isPassIncluded: true,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    stems: [
      { name: 'Lead Vocal (Narrator Dry)', type: 'vocal', waveformMock: [30, 60, 45, 80, 95, 70, 50, 85, 40] },
      { name: 'Character Voices (Frodo & Bilbo)', type: 'vocal', waveformMock: [20, 40, 60, 50, 75, 40, 60, 30, 20] },
      { name: 'Shire Tavern Hearth & Rain Foley', type: 'foley', waveformMock: [15, 20, 25, 20, 15, 20, 25, 20, 15] },
      { name: 'Acoustic Celtic Lute & Strings', type: 'music', waveformMock: [40, 55, 60, 70, 65, 80, 50, 45, 60] }
    ],
    tags: ['Isolated Vocals', 'Royalty-Free', 'Foley Stems', 'FLAC / 24-bit WAV']
  },
  {
    id: 'stems_innsmouth_horror',
    title: 'Shadows on the Wharf (Atmospheric Dark Pack)',
    narrator: 'GrimNarrator',
    bookTitle: 'The Shadow over Innsmouth',
    genre: 'Gothic Horror',
    duration: '22m 15s',
    bpm: '60 BPM',
    key: 'C Minor',
    price: 15,
    isPassIncluded: false,
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80',
    stems: [
      { name: 'Deep Whispering Narration', type: 'vocal', waveformMock: [25, 45, 70, 85, 60, 40, 65, 80, 55] },
      { name: 'Atlantic Ocean Waves & Foghorn', type: 'foley', waveformMock: [30, 35, 40, 35, 30, 40, 50, 45, 35] },
      { name: 'Sub-Bass Drone & Dissonant Cello', type: 'music', waveformMock: [50, 60, 75, 80, 90, 85, 70, 60, 50] }
    ],
    tags: ['Horror Soundscape', 'Commercial License', 'Podcasting Ready']
  }
];
