export interface SparksPinataData {
  goalSparks: number;
  currentSparks: number;
  topDonors: Array<{
    username: string;
    sparksContributed: number;
    avatar: string;
  }>;
  dragonState: 'SLEEPING' | 'AWAKENING' | 'UNLEASHED';
  bonusRewardDrop: string;
}

export const ACTIVE_SPARKS_PINATA: SparksPinataData = {
  goalSparks: 10000,
  currentSparks: 8450,
  topDonors: [
    {
      username: 'BilboFanatic',
      sparksContributed: 2500,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&auto=format&fit=crop&q=80'
    },
    {
      username: 'SarahReads',
      sparksContributed: 1800,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80'
    },
    {
      username: 'LoreSeeker_Dan',
      sparksContributed: 1200,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=64&auto=format&fit=crop&q=80'
    }
  ],
  dragonState: 'AWAKENING',
  bonusRewardDrop: '🐉 Golden Smaug Emote + 500 Free Sparks for all chat viewers!'
};
