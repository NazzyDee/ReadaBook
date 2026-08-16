export interface SkillTreeNode {
  id: string;
  name: string;
  branch: 'VOCAL_SORCERY' | 'COMMUNITY' | 'AUDIO_TECH' | 'LORE_MASTERY';
  levelRequired: number;
  xpCost: number;
  perkDescription: string;
  icon: string;
  isUnlocked: boolean;
}

export const MOCK_SKILL_TREE_NODES: SkillTreeNode[] = [
  {
    id: 'sk_vocal_1',
    name: 'Syllable Cadence Pacer',
    branch: 'VOCAL_SORCERY',
    levelRequired: 1,
    xpCost: 100,
    perkDescription: 'Unlocks dynamic live Words-Per-Minute telemetry HUD on stream.',
    icon: '🎙️',
    isUnlocked: true
  },
  {
    id: 'sk_vocal_2',
    name: 'Harmonic Voice Modulation',
    branch: 'VOCAL_SORCERY',
    levelRequired: 5,
    xpCost: 500,
    perkDescription: 'Enables 12 character pitch morphing presets (Goblin, Dragon, Elf).',
    icon: '🔮',
    isUnlocked: true
  },
  {
    id: 'sk_comm_1',
    name: 'Sparks Magnet',
    branch: 'COMMUNITY',
    levelRequired: 3,
    xpCost: 300,
    perkDescription: 'Community earns +10% bonus Sparks during live chapter readings.',
    icon: '✨',
    isUnlocked: true
  },
  {
    id: 'sk_comm_2',
    name: 'Grand Patron Sub Gifting Podiums',
    branch: 'COMMUNITY',
    levelRequired: 8,
    xpCost: 800,
    perkDescription: 'Unlocks golden crown flair for top 3 community gifters.',
    icon: '👑',
    isUnlocked: false
  },
  {
    id: 'sk_audio_1',
    name: 'Sidechain Voice Ducking',
    branch: 'AUDIO_TECH',
    levelRequired: 2,
    xpCost: 200,
    perkDescription: 'Automatic background soundtrack volume dip by -18dB when speaking.',
    icon: '🎚️',
    isUnlocked: true
  },
  {
    id: 'sk_audio_2',
    name: 'Squad 3D Soundstage',
    branch: 'AUDIO_TECH',
    levelRequired: 10,
    xpCost: 1200,
    perkDescription: 'Binaural 360-degree spatial audio positioning for co-streamers.',
    icon: '🎧',
    isUnlocked: false
  }
];
