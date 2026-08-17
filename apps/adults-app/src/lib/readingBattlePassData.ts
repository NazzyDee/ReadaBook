export interface BattlePassTier {
  tierNumber: number;
  rewardName: string;
  requiredXp: number;
  isUnlocked: boolean;
  isClaimed: boolean;
  rewardType: 'EMOTE' | 'BADGE' | 'SPINE_SKIN' | 'AUDIO_FILTER';
}

export interface ReadingBattlePassSeason {
  seasonTitle: string; // e.g. "Season 4: The Winter of Epic Fantasies"
  currentTier: number;
  currentXp: number;
  maxXpForNextTier: number;
  daysRemainingInSeason: number;
  tiers: BattlePassTier[];
}

export const DEFAULT_BATTLE_PASS: ReadingBattlePassSeason = {
  seasonTitle: 'Tome of Seasons: Autumn of the Dragons',
  currentTier: 14,
  currentXp: 1420,
  maxXpForNextTier: 2000,
  daysRemainingInSeason: 28,
  tiers: [
    {
      tierNumber: 13,
      rewardName: '🔥 Dragon-Flame Text Highlighter',
      requiredXp: 1000,
      isUnlocked: true,
      isClaimed: true,
      rewardType: 'EMOTE'
    },
    {
      tierNumber: 14,
      rewardName: '🛡️ Mythic Gold-Leaf Chat Badge',
      requiredXp: 1500,
      isUnlocked: true,
      isClaimed: false,
      rewardType: 'BADGE'
    },
    {
      tierNumber: 15,
      rewardName: '📜 Holographic Dragon-Leather Spine Skin',
      requiredXp: 2000,
      isUnlocked: false,
      isClaimed: false,
      rewardType: 'SPINE_SKIN'
    }
  ]
};
