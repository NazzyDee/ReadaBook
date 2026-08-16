export interface GoldLeafHypeTrain {
  currentLevel: number;
  maxLevel: number;
  currentProgressPct: number;
  timeRemainingSeconds: number;
  totalGoldLeavesErupted: number;
  recentContributors: { name: string; sparksDonated: number }[];
  unlockedPerks: string[];
}

export const DEFAULT_HYPE_VOLCANO: GoldLeafHypeTrain = {
  currentLevel: 100,
  maxLevel: 100,
  currentProgressPct: 100,
  timeRemainingSeconds: 240,
  totalGoldLeavesErupted: 58400,
  recentContributors: [
    { name: 'GondorArchivist', sparksDonated: 10000 },
    { name: 'ArwenFanatic', sparksDonated: 5000 },
    { name: 'HobbitLover', sparksDonated: 2500 }
  ],
  unlockedPerks: [
    '24K Gold Leaf Screen Rain FX for All Viewers',
    '30-Minute Author Double XP Boost',
    'Exclusive Legendary Gold Folio Badge'
  ]
};
