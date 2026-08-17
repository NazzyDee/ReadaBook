export interface ClonedCharacterVoice {
  id: string;
  characterName: string;
  voiceGender: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'MONSTER';
  pitchShift: number; // -12 to +12 semitones
  reverbDecaySeconds: number; // 0.1 to 4.0
  formantWarp: number; // 0.5 to 2.0
  sampleDialogue: string;
  isAiCloneActive: boolean;
}

export const DEFAULT_CLONED_VOICES: ClonedCharacterVoice[] = [
  {
    id: 'voice_gandalf',
    characterName: 'Archmage Eldrin (Deep Runic Sage)',
    voiceGender: 'MALE',
    pitchShift: -4,
    reverbDecaySeconds: 2.2,
    formantWarp: 0.85,
    sampleDialogue: '"Do not speak to me of forgotten oaths while the embers still glow in the western sky."',
    isAiCloneActive: true
  },
  {
    id: 'voice_dragon',
    characterName: 'Ignis the Wyrm (Sub-Harmonic Dragon)',
    voiceGender: 'MONSTER',
    pitchShift: -9,
    reverbDecaySeconds: 3.5,
    formantWarp: 0.65,
    sampleDialogue: '"YOUR SHIELDS ARE CRUMBLED DUST BEFORE MY BREATH."',
    isAiCloneActive: false
  },
  {
    id: 'voice_fae',
    characterName: 'Sylvia of the Moonlit Glade (Ethereal Siren)',
    voiceGender: 'FEMALE',
    pitchShift: 3,
    reverbDecaySeconds: 1.8,
    formantWarp: 1.25,
    sampleDialogue: '"Follow the silver bell across the moss, and do not look behind you."',
    isAiCloneActive: false
  }
];
