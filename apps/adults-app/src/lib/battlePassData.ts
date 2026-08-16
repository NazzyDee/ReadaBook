export interface BattlePassTier {
  level: number;
  freeReward: {
    name: string;
    type: 'tokens' | 'badge' | 'sound';
    icon: string;
    value: string;
  };
  premiumReward: {
    name: string;
    type: 'tokens' | 'animated_badge' | 'theme' | 'aura';
    icon: string;
    value: string;
  };
}

export interface BattlePassQuest {
  id: string;
  title: string;
  category: 'daily' | 'weekly';
  xpReward: number;
  currentProgress: number;
  maxProgress: number;
  isClaimed: boolean;
  unit: string;
}

export const SAMPLE_PASS_TIERS: BattlePassTier[] = [
  {
    level: 1,
    freeReward: { name: '50 Book Tokens', type: 'tokens', icon: '🪙', value: '+50 Tokens' },
    premiumReward: { name: 'Mithril Armor Chat Badge', type: 'animated_badge', icon: '🛡️', value: 'Exclusive Badge' }
  },
  {
    level: 2,
    freeReward: { name: 'Page Turner Crest', type: 'badge', icon: '📖', value: 'Chat Badge' },
    premiumReward: { name: '100 Book Tokens', type: 'tokens', icon: '🪙', value: '+100 Tokens' }
  },
  {
    level: 3,
    freeReward: { name: 'Campfire Crackle Sound', type: 'sound', icon: '🔥', value: 'Ambient Sound' },
    premiumReward: { name: 'Elven Glade Stream Theme', type: 'theme', icon: '🍃', value: 'UI Theme' }
  },
  {
    level: 4,
    freeReward: { name: '75 Book Tokens', type: 'tokens', icon: '🪙', value: '+75 Tokens' },
    premiumReward: { name: 'Golden Name Glow Aura', type: 'aura', icon: '✨', value: 'Chat Aura' }
  },
  {
    level: 5,
    freeReward: { name: 'Fellowship Wayfarer Crest', type: 'badge', icon: '🧝', value: 'Chat Badge' },
    premiumReward: { name: 'Dragon Slayer Animated Badge', type: 'animated_badge', icon: '🐉', value: 'Animated Badge' }
  },
  {
    level: 6,
    freeReward: { name: '100 Book Tokens', type: 'tokens', icon: '🪙', value: '+100 Tokens' },
    premiumReward: { name: '200 Book Tokens', type: 'tokens', icon: '🪙', value: '+200 Tokens' }
  },
  {
    level: 7,
    freeReward: { name: 'Ocean Mist Sound', type: 'sound', icon: '🌊', value: 'Ambient Sound' },
    premiumReward: { name: 'Deep Moria Dark Theme', type: 'theme', icon: '⛏️', value: 'UI Theme' }
  },
  {
    level: 8,
    freeReward: { name: '150 Book Tokens', type: 'tokens', icon: '🪙', value: '+150 Tokens' },
    premiumReward: { name: 'Crown of Gondor Animated Badge', type: 'animated_badge', icon: '👑', value: 'Animated Badge' }
  },
  {
    level: 9,
    freeReward: { name: 'Lorekeeper Crest', type: 'badge', icon: '📜', value: 'Chat Badge' },
    premiumReward: { name: 'Cyan Ethereal Name Aura', type: 'aura', icon: '💫', value: 'Chat Aura' }
  },
  {
    level: 10,
    freeReward: { name: '250 Book Tokens', type: 'tokens', icon: '🪙', value: '+250 Tokens' },
    premiumReward: { name: 'Ringbearer Legendary Badge & 500 Tokens', type: 'animated_badge', icon: '💍', value: 'Legendary Badge' }
  }
];

export const INITIAL_QUESTS: BattlePassQuest[] = [
  {
    id: 'q1',
    title: 'Listen to 20 minutes of live reading',
    category: 'daily',
    xpReward: 250,
    currentProgress: 20,
    maxProgress: 20,
    isClaimed: false,
    unit: 'mins'
  },
  {
    id: 'q2',
    title: 'Complete one 25m Silent Focus Sprint',
    category: 'daily',
    xpReward: 300,
    currentProgress: 1,
    maxProgress: 1,
    isClaimed: false,
    unit: 'sprint'
  },
  {
    id: 'q3',
    title: 'Answer 3 questions in Book Battle Arena',
    category: 'daily',
    xpReward: 350,
    currentProgress: 2,
    maxProgress: 3,
    isClaimed: false,
    unit: 'questions'
  },
  {
    id: 'q4',
    title: 'Log 50 pages in the Sprint Logger',
    category: 'weekly',
    xpReward: 1200,
    currentProgress: 35,
    maxProgress: 50,
    isClaimed: false,
    unit: 'pages'
  },
  {
    id: 'q5',
    title: 'Gift 1 Subscription or Cheer 100 Bits',
    category: 'weekly',
    xpReward: 1500,
    currentProgress: 1,
    maxProgress: 1,
    isClaimed: false,
    unit: 'gift'
  }
];
