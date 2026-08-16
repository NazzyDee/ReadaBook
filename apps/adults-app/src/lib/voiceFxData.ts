export interface VoicePreset {
  id: string;
  name: string;
  category: 'Fantasy' | 'Sci-Fi' | 'Creature' | 'Acoustic';
  icon: string;
  description: string;
  pitchShiftSemis: number; // e.g. -12 for deep dragon, +8 for fairy
  reverbDecaySeconds: number; // 0 to 8
  lowPassCutoffHz: number; // 200 to 20000
  resonanceBoostDb: number;
  stereoWidthPercent: number;
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'preset_natural',
    name: 'Studio Clean Warmth',
    category: 'Acoustic',
    icon: '🎙️',
    description: 'Crisp, natural audiobook narrator warmth with subtle room acoustics.',
    pitchShiftSemis: 0,
    reverbDecaySeconds: 0.5,
    lowPassCutoffHz: 20000,
    resonanceBoostDb: 0,
    stereoWidthPercent: 100
  },
  {
    id: 'preset_dragon_roar',
    name: 'Ancient Dragon Wyrm',
    category: 'Creature',
    icon: '🐉',
    description: 'Earth-shaking sub-bass growl with fiery cavern resonance and deep pitch drop.',
    pitchShiftSemis: -9,
    reverbDecaySeconds: 4.5,
    lowPassCutoffHz: 1200,
    resonanceBoostDb: 6,
    stereoWidthPercent: 140
  },
  {
    id: 'preset_elven_echo',
    name: 'Elven Ethereal Echo',
    category: 'Fantasy',
    icon: '🧝‍♀️',
    description: 'Silvery cathedral shimmer with high-frequency harmonic reflections.',
    pitchShiftSemis: 3,
    reverbDecaySeconds: 5.2,
    lowPassCutoffHz: 16000,
    resonanceBoostDb: 3,
    stereoWidthPercent: 180
  },
  {
    id: 'preset_ancient_wizard',
    name: 'Grand Arch-Mage Reverb',
    category: 'Fantasy',
    icon: '🧙‍♂️',
    description: 'Deep authoritative resonance suited for epic spellcasting and elder dialogue.',
    pitchShiftSemis: -4,
    reverbDecaySeconds: 3.8,
    lowPassCutoffHz: 3500,
    resonanceBoostDb: 4,
    stereoWidthPercent: 130
  },
  {
    id: 'preset_cyberpunk_synth',
    name: 'Cybernetic AI Voice',
    category: 'Sci-Fi',
    icon: '🤖',
    description: 'Robotic vocoder ring-modulation with sharp bandpass cutoff.',
    pitchShiftSemis: -2,
    reverbDecaySeconds: 1.2,
    lowPassCutoffHz: 2400,
    resonanceBoostDb: 8,
    stereoWidthPercent: 110
  },
  {
    id: 'preset_whispering_ghost',
    name: 'Phantasmal Whisper',
    category: 'Creature',
    icon: '👻',
    description: 'Airy spectral presence with binaural stereo oscillation and breath enhancer.',
    pitchShiftSemis: 5,
    reverbDecaySeconds: 6.0,
    lowPassCutoffHz: 8000,
    resonanceBoostDb: -2,
    stereoWidthPercent: 200
  },
  {
    id: 'preset_playful_pixie',
    name: 'Playful Forest Pixie',
    category: 'Fantasy',
    icon: '🧚',
    description: 'High-pitched twinkling vocal timbre with joyful spring reverb.',
    pitchShiftSemis: 8,
    reverbDecaySeconds: 2.0,
    lowPassCutoffHz: 18000,
    resonanceBoostDb: 2,
    stereoWidthPercent: 120
  }
];
