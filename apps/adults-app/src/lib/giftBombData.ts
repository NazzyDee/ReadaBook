export interface GiftBombTier {
  id: string;
  quantity: number;
  priceUsd: number;
  title: string;
  badge: string;
  glowColor: string;
  isPopular?: boolean;
}

export const GIFT_BOMB_TIERS: GiftBombTier[] = [
  { id: 'bomb_5', quantity: 5, priceUsd: 24.95, title: '5 Gift Subscriptions', badge: '🎁 Bronze Shower', glowColor: '#cd7f32' },
  { id: 'bomb_10', quantity: 10, priceUsd: 49.90, title: '10 Gift Subscriptions', badge: '⚡ Silver Burst', glowColor: '#a0aec0', isPopular: true },
  { id: 'bomb_25', quantity: 25, priceUsd: 124.75, title: '25 Guild Scholar Pack', badge: '📜 Gold Tome', glowColor: '#ffd700' },
  { id: 'bomb_50', quantity: 50, priceUsd: 249.50, title: '50 Grand Patron Bomb', badge: '🧙 Lore Master Tier', glowColor: '#9d4edd' },
  { id: 'bomb_100', quantity: 100, priceUsd: 499.00, title: '100 Immortal Founder Legacy', badge: '👑 Golden King Crown', glowColor: '#ff0055' }
];

export const MOCK_ACTIVE_CHATTERS = [
  'NovelScholar',
  'GrimNarrator',
  'BookWorm_42',
  'LillysNumberOneFan',
  'FrodoBagEnd',
  'CosmereSeeker',
  'AragornStrider',
  'ElvenScribe',
  'DuneWanderer',
  'KvotheTheBloodless',
  'MistbornHero',
  'GandalfTheGrey',
  'Bibliophile_88',
  'NightReader_22'
];
