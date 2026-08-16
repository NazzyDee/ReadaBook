export interface SubTier {
  id: 'tier1' | 'tier2' | 'tier3';
  name: string;
  price: number;
  badgeName: string;
  badgeIcon: string;
  badgeColor: string;
  perks: string[];
  exclusiveEmotes: string[];
}

export const SUB_TIERS: SubTier[] = [
  {
    id: 'tier1',
    name: 'Apprentice Reader (Tier 1)',
    price: 4.99,
    badgeName: 'Bronze Feather Quill',
    badgeIcon: '🪶',
    badgeColor: '#cd7f32',
    perks: [
      'Ad-free reading broadcasts & VODs',
      'Exclusive Bronze Feather subscriber chat badge',
      'Access to 10 channel-exclusive custom book emotes',
      '1.2x Channel Points multiplier during live streams',
      'Subscriber-only Discord role & reading group'
    ],
    exclusiveEmotes: ['📖', '☕', '✨', '🔥', '🐉', '🧙‍♂️', '🦉', '📜', '⚔️', '🛡️']
  },
  {
    id: 'tier2',
    name: 'Master Scholar (Tier 2)',
    price: 9.99,
    badgeName: 'Silver Tome & Compass',
    badgeIcon: '🧭',
    badgeColor: '#c0c0c0',
    perks: [
      'All Tier 1 Perks included',
      'Silver Shimmer subscriber badge upgrade',
      '5 additional animated channel emotes',
      '1.5x Channel Points multiplier',
      'Access to private Sub-only Co-Listening Lounges',
      'Monthly Book Club digital discussion guide PDF'
    ],
    exclusiveEmotes: ['🌟', '🏰', '🔮', '🦄', '⚡']
  },
  {
    id: 'tier3',
    name: 'Grand Arch-Mage (Tier 3)',
    price: 24.99,
    badgeName: 'Golden Dragon Arch-Mage',
    badgeIcon: '👑',
    badgeColor: '#ffd700',
    perks: [
      'All Tier 1 & Tier 2 Perks included',
      'Legendary Golden Dragon halo chat aura',
      '2.0x Channel Points multiplier',
      'Permanent name inscription on Streamer Channel Hall of Fame',
      'Monthly 1-on-1 Virtual Book Club Q&A with the Streamer',
      'Custom text-to-speech audio alert trigger upon entering stream'
    ],
    exclusiveEmotes: ['👑', '💫', '💎', '🌈']
  }
];

export interface GiftPackage {
  count: number;
  label: string;
  totalPrice: number;
  discountBadge?: string;
}

export const GIFT_PACKAGES: GiftPackage[] = [
  { count: 1, label: 'Gift 1 Sub', totalPrice: 4.99 },
  { count: 5, label: 'Gift 5 Subs', totalPrice: 24.95, discountBadge: 'Popular' },
  { count: 10, label: 'Gift 10 Subs', totalPrice: 49.90 },
  { count: 20, label: 'Gift 20 Subs', totalPrice: 99.80, discountBadge: 'Patron' },
  { count: 50, label: 'Gift 50 Subs', totalPrice: 249.50, discountBadge: 'Heroic' },
  { count: 100, label: 'Gift 100 Subs', totalPrice: 499.00, discountBadge: 'Legendary' }
];

export interface SubStatus {
  isSubscribed: boolean;
  tierId?: 'tier1' | 'tier2' | 'tier3';
  streamerId?: string;
  streamerName?: string;
  renewDate?: string;
  monthsSubscribed: number;
}
