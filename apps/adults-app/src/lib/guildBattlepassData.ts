export interface BattlepassTier {
  tierNumber: number;
  xpRequired: number;
  freeReward: string;
  patronReward: string;
  isUnlocked: boolean;
  isClaimed: boolean;
}

export const SEASONAL_BATTLEPASS_DATA: BattlepassTier[] = [
  {
    tierNumber: 1,
    xpRequired: 100,
    freeReward: '📜 Bronze Parchment Chat Flair',
    patronReward: '👑 3D Golden Mithril Crown Avatar Frame',
    isUnlocked: true,
    isClaimed: true
  },
  {
    tierNumber: 2,
    xpRequired: 250,
    freeReward: '✨ +100 Bonus Sparks Drop',
    patronReward: '🎙️ Custom Dwarf King Donation TTS Soundbite',
    isUnlocked: true,
    isClaimed: false
  },
  {
    tierNumber: 3,
    xpRequired: 500,
    freeReward: '🧝 Sindarin Leaf Emote',
    patronReward: '💎 Holographic Dragon Egg Bookshelf Trophy',
    isUnlocked: true,
    isClaimed: false
  },
  {
    tierNumber: 4,
    xpRequired: 1000,
    freeReward: '🛡️ Shield of the West Chat Badge',
    patronReward: '🔮 Elessar Green Jewel Profile Aura',
    isUnlocked: false,
    isClaimed: false
  }
];
