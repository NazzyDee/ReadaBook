export interface FoundingSubscriber {
  rank: number;
  username: string;
  avatarUrl: string;
  foundingDate: string;
  badgeTitle: string;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  totalTenureMonths: number;
  isFirstTenFounder: boolean;
}

export const FOUNDING_READERS_LIST: FoundingSubscriber[] = [
  {
    rank: 1,
    username: 'BilboFanatic',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&auto=format&fit=crop&q=80',
    foundingDate: 'Day 1 (Founder #1)',
    badgeTitle: '⚜️ Primordial Scribe',
    tier: 'TIER_3',
    totalTenureMonths: 24,
    isFirstTenFounder: true
  },
  {
    rank: 2,
    username: 'LoreSeeker_Dan',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=64&auto=format&fit=crop&q=80',
    foundingDate: 'Day 1 (Founder #2)',
    badgeTitle: '📜 First Folio Keeper',
    tier: 'TIER_3',
    totalTenureMonths: 24,
    isFirstTenFounder: true
  },
  {
    rank: 3,
    username: 'ElvenScholar',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&auto=format&fit=crop&q=80',
    foundingDate: 'Day 2 (Founder #3)',
    badgeTitle: '🧝 Sindarin Archivist',
    tier: 'TIER_2',
    totalTenureMonths: 23,
    isFirstTenFounder: true
  },
  {
    rank: 4,
    username: 'DwarvenForge',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80',
    foundingDate: 'Day 3 (Founder #4)',
    badgeTitle: '⛏️ Mithril Patron',
    tier: 'TIER_1',
    totalTenureMonths: 22,
    isFirstTenFounder: true
  }
];
