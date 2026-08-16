export interface CreatorAchievement {
  id: string;
  title: string;
  description: string;
  category: 'Broadcasting' | 'Community' | 'Literary Mastery' | 'Revenue';
  currentProgress: number;
  targetProgress: number;
  unit: string;
  isUnlocked: boolean;
  rewardText: string;
  icon: string;
}

export const MOCK_CREATOR_ACHIEVEMENTS: CreatorAchievement[] = [
  {
    id: 'ach_hours',
    title: 'Grand Voice Endurance',
    description: 'Broadcast live reading for a total of 50 cumulative hours.',
    category: 'Broadcasting',
    currentProgress: 38,
    targetProgress: 50,
    unit: 'hours',
    isUnlocked: false,
    rewardText: 'Unlocks +5 Custom Animated Channel Emote Slots',
    icon: '⏳'
  },
  {
    id: 'ach_series',
    title: 'Epic Lore Finisher',
    description: 'Complete 5 full audiobook book series live from start to finish.',
    category: 'Literary Mastery',
    currentProgress: 5,
    targetProgress: 5,
    unit: 'series',
    isUnlocked: true,
    rewardText: 'Golden “Master Storyteller” Verified Quill Badge',
    icon: '📜'
  },
  {
    id: 'ach_raids',
    title: 'Caravan Fleet Commander',
    description: 'Lead 25 raid caravans to fellow book club broadcasters.',
    category: 'Community',
    currentProgress: 19,
    targetProgress: 25,
    unit: 'raids',
    isUnlocked: false,
    rewardText: 'Unlocks Custom Raid Intro Soundboard Stems',
    icon: '⚔️'
  },
  {
    id: 'ach_subs',
    title: 'Guild Patron Patronage',
    description: 'Reach 500 active Guild subscribers and book club patrons.',
    category: 'Revenue',
    currentProgress: 412,
    targetProgress: 500,
    unit: 'patrons',
    isUnlocked: false,
    rewardText: 'Upgraded 75/25 Creator Revenue Split Tier',
    icon: '👑'
  }
];
