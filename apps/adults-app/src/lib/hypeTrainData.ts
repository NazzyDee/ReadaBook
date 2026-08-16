export interface HypeTrainLevel {
  level: number;
  targetPoints: number;
  rewardTitle: string;
  rewardEmoteIcon: string;
  rewardDescription: string;
}

export interface HypeTrainState {
  isActive: boolean;
  currentLevel: number;
  currentPoints: number;
  targetPoints: number;
  secondsRemaining: number;
  totalContributors: number;
  recentActions: {
    user: string;
    action: string;
    points: number;
    avatar: string;
  }[];
  levels: HypeTrainLevel[];
}

export const DEFAULT_HYPE_TRAIN_DATA: HypeTrainState = {
  isActive: true,
  currentLevel: 3,
  currentPoints: 1850,
  targetPoints: 2500,
  secondsRemaining: 240,
  totalContributors: 48,
  recentActions: [
    { user: 'NovelScholar', action: 'Gifted 5 Tier 1 Subs', points: 500, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { user: 'GrimNarrator', action: 'Cheered 1,000 Sparks', points: 250, avatar: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=200&q=80' },
    { user: 'BookWorm_42', action: 'Completed Chapter Sprint', points: 100, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' }
  ],
  levels: [
    { level: 1, targetPoints: 500, rewardTitle: 'Bronze Reading Rune', rewardEmoteIcon: '🥉', rewardDescription: 'Unlocked Bronze Rune Chat Badge' },
    { level: 2, targetPoints: 1200, rewardTitle: 'Silver Mithril Quill', rewardEmoteIcon: '✒️', rewardDescription: 'Unlocked Mithril Quill Emote' },
    { level: 3, targetPoints: 2500, rewardTitle: 'Golden Dragon Spine Emote', rewardEmoteIcon: '🐉', rewardDescription: 'Unlocked Animated Dragon Spine Emote' },
    { level: 4, targetPoints: 4500, rewardTitle: 'Crown of High Lore', rewardEmoteIcon: '👑', rewardDescription: 'Exclusive High Lore Discord Flair' },
    { level: 5, targetPoints: 8000, rewardTitle: 'The One Ring Foil Edition', rewardEmoteIcon: '💍', rewardDescription: 'Legendary Golden Ring Overlay & 4K Wallpaper Pack' }
  ]
};
