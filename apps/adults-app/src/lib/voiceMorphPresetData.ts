export interface VoicePadPreset {
  id: string;
  padNumber: number;
  name: string;
  category: 'CHARACTER_VOICE' | 'FOLEY_SFX';
  pitchShiftSemitones: number;
  formantShift: number;
  iconEmoji: string;
  hotkeyKey: string;
}

export const AVAILABLE_VOICE_PADS: VoicePadPreset[] = [
  {
    id: 'pad_wizard',
    padNumber: 1,
    name: 'Ancient Grey Wizard',
    category: 'CHARACTER_VOICE',
    pitchShiftSemitones: -4,
    formantShift: 0.85,
    iconEmoji: '🧙‍♂️',
    hotkeyKey: 'NUM 1'
  },
  {
    id: 'pad_goblin',
    padNumber: 2,
    name: 'Moria Goblin Scout',
    category: 'CHARACTER_VOICE',
    pitchShiftSemitones: 6,
    formantShift: 1.35,
    iconEmoji: '👺',
    hotkeyKey: 'NUM 2'
  },
  {
    id: 'pad_dragon',
    padNumber: 3,
    name: 'Dragon King (Smaug)',
    category: 'CHARACTER_VOICE',
    pitchShiftSemitones: -8,
    formantShift: 0.7,
    iconEmoji: '🐉',
    hotkeyKey: 'NUM 3'
  },
  {
    id: 'pad_elf_queen',
    padNumber: 4,
    name: 'Galadriel Lothlórien Echo',
    category: 'CHARACTER_VOICE',
    pitchShiftSemitones: 2,
    formantShift: 1.1,
    iconEmoji: '🧝‍♀️',
    hotkeyKey: 'NUM 4'
  },
  {
    id: 'pad_sword_clash',
    padNumber: 5,
    name: 'Valyrian Steel Clash',
    category: 'FOLEY_SFX',
    pitchShiftSemitones: 0,
    formantShift: 1.0,
    iconEmoji: '⚔️',
    hotkeyKey: 'NUM 5'
  },
  {
    id: 'pad_thunder_strike',
    padNumber: 6,
    name: 'Mount Doom Thunder Crash',
    category: 'FOLEY_SFX',
    pitchShiftSemitones: 0,
    formantShift: 1.0,
    iconEmoji: '⚡',
    hotkeyKey: 'NUM 6'
  }
];
