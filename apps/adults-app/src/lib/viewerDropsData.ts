export interface LiteraryDropItem {
  id: string;
  title: string;
  type: 'Emote' | 'Audio Stem' | 'Digital Artwork' | 'Audiobook Chapter';
  requiredWatchMinutes: number;
  currentWatchedMinutes: number;
  isClaimed: boolean;
  isUnlocked: boolean;
  imageUrl: string;
  description: string;
}

export const MOCK_VIEWER_DROPS: LiteraryDropItem[] = [
  {
    id: 'drop_animated_rune',
    title: '“Eye of Sauron” Glowing Animated Chat Rune',
    type: 'Emote',
    requiredWatchMinutes: 30,
    currentWatchedMinutes: 30,
    isUnlocked: true,
    isClaimed: false,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
    description: 'Exclusive fiery animated chat emote unlocked for watching 30 minutes of high fantasy reading.'
  },
  {
    id: 'drop_shire_flac',
    title: 'Shire Tavern Hearth Isolated Foley Track (FLAC)',
    type: 'Audio Stem',
    requiredWatchMinutes: 60,
    currentWatchedMinutes: 45,
    isUnlocked: false,
    isClaimed: false,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    description: 'High-definition 24-bit audio stem of crackling hearth and Shire rain for your own ambient reading.'
  },
  {
    id: 'drop_concept_art',
    title: 'Moria Gates 4K Concept Digital Art Wallpaper',
    type: 'Digital Artwork',
    requiredWatchMinutes: 120,
    currentWatchedMinutes: 45,
    isUnlocked: false,
    isClaimed: false,
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=300&q=80',
    description: 'Official digital collector wallpaper illustrated by verified community emote artists.'
  }
];
