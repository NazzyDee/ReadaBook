export interface ChannelReward {
  id: string;
  title: string;
  cost: number;
  description: string;
  icon: string;
  color: string;
  cooldownSeconds?: number;
  requiresInput?: boolean;
  inputPrompt?: string;
}

export interface CheerTier {
  bits: number;
  name: string;
  icon: string;
  color: string;
  soundName?: string;
  badgeLevel: string;
}

export const CHEER_TIERS: CheerTier[] = [
  { bits: 1, name: '1 Spark', icon: '✨', color: '#9d9d9d', badgeLevel: 'Bronze Reader' },
  { bits: 100, name: '100 Sparks', icon: '💜', color: '#8a2be2', badgeLevel: 'Purple Bookmark' },
  { bits: 500, name: '500 Sparks', icon: '🔷', color: '#00e5ff', badgeLevel: 'Cyan Quiver' },
  { bits: 1000, name: '1,000 Sparks', icon: '💚', color: '#00e676', badgeLevel: 'Emerald Scholar' },
  { bits: 5000, name: '5,000 Sparks', icon: '💎', color: '#3d5afe', badgeLevel: 'Diamond Lorekeeper' },
  { bits: 10000, name: '10,000 Sparks', icon: '👑', color: '#ffd700', badgeLevel: 'Golden Scribe' }
];

export const DEFAULT_CHANNEL_REWARDS: ChannelReward[] = [
  {
    id: 'highlight-msg',
    title: 'Highlight My Message',
    cost: 150,
    description: 'Make your message shine in fluorescent orange for all viewers & streamer to notice!',
    icon: '✨',
    color: '#ff9800',
    requiresInput: true,
    inputPrompt: 'Enter your message to highlight:'
  },
  {
    id: 'hydrate-tea',
    title: 'Tea & Hydrate Reminder',
    cost: 250,
    description: 'Remind the narrator to take a sip of water or cozy warm tea!',
    icon: '☕',
    color: '#00bcd4'
  },
  {
    id: 'voice-accent',
    title: 'Read in Character Voice',
    cost: 500,
    description: 'Choose a character accent (British, Pirate, French, Wizard) for the next page!',
    icon: '🎭',
    color: '#9c27b0',
    requiresInput: true,
    inputPrompt: 'Which accent/character voice should the streamer use?'
  },
  {
    id: 'sub-emote-24h',
    title: 'Unlock Sub Emotes (24h)',
    cost: 1000,
    description: 'Access all Tier 3 channel subscriber emotes for the next 24 hours!',
    icon: '🌟',
    color: '#ff4081'
  },
  {
    id: 'quote-highlight',
    title: 'Pin Favorite Book Quote',
    cost: 2000,
    description: 'Pin an inspiring sentence from this chapter to the top of the chat for 5 minutes!',
    icon: '📌',
    color: '#4caf50',
    requiresInput: true,
    inputPrompt: 'Which quote would you like to pin?'
  },
  {
    id: 'choose-next-book',
    title: 'Nominate Next Stream Book',
    cost: 5000,
    description: 'Add your favorite novel to the community poll for next week\'s live read-along!',
    icon: '🏆',
    color: '#ffd700',
    requiresInput: true,
    inputPrompt: 'Book title and author to nominate:'
  }
];

export interface PredictionOption {
  id: string;
  title: string;
  color: string;
  totalTokens: number;
  userTokens?: number;
  totalUsers: number;
}

export interface Prediction {
  id: string;
  question: string;
  options: PredictionOption[];
  status: 'active' | 'locked' | 'resolved' | 'canceled';
  createdAt: number;
  locksAt: number;
  winningOptionId?: string;
  streamerId: string;
}
