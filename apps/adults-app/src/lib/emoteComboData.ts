export interface EmoteComboEvent {
  emoteCode: string;
  emoji: string;
  count: number;
  multiplierText: string;
  glowColor: string;
  isActive: boolean;
}

export const SAMPLE_EMOTE_COMBOS: EmoteComboEvent[] = [
  {
    emoteCode: 'PAGE_TURN',
    emoji: '📖',
    count: 12,
    multiplierText: 'x12 SPEED READER COMBO!',
    glowColor: '#00ff88',
    isActive: true
  },
  {
    emoteCode: 'DRAGON_ROAR',
    emoji: '🐉',
    count: 25,
    multiplierText: 'x25 ULTRA HYPETRAIN BLAST!',
    glowColor: '#ff0055',
    isActive: true
  },
  {
    emoteCode: 'TEA_CHEERS',
    emoji: '☕',
    count: 8,
    multiplierText: 'x8 COZY SIP STREAK!',
    glowColor: '#ffd700',
    isActive: true
  }
];
