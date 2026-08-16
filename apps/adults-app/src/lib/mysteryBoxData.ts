export interface GiveawayPrize {
  id: string;
  name: string;
  category: 'Physical Book' | 'Signed Bookplate' | 'Audiobook Bundle' | 'Merch Swag';
  description: string;
  estimatedValueUsd: number;
  icon: string;
  color: string;
}

export const MOCK_GIVEAWAY_PRIZES: GiveawayPrize[] = [
  {
    id: 'prize_hardcover',
    name: 'Signed Collector’s Hardcover Edition',
    category: 'Physical Book',
    description: 'Foil-embossed collector’s edition signed live on-stream by the author.',
    estimatedValueUsd: 45.00,
    icon: '📚',
    color: '#ffd700'
  },
  {
    id: 'prize_bookplate',
    name: 'Gilded Author Bookplate & Ribbon Bookmark',
    category: 'Signed Bookplate',
    description: 'Gold foil adhesive signature bookplate and embroidered cloth bookmark.',
    estimatedValueUsd: 15.00,
    icon: '✨',
    color: '#00ff88'
  },
  {
    id: 'prize_audio_bundle',
    name: 'Complete Audiobook Master Trilogy (Lossless FLAC)',
    category: 'Audiobook Bundle',
    description: 'Digital bundle of all 3 volumes with full stems and orchestral score.',
    estimatedValueUsd: 60.00,
    icon: '🎧',
    color: '#00b4d8'
  },
  {
    id: 'prize_swag_box',
    name: 'Bibliophile Cozy Hearth Mug & Tea Blend',
    category: 'Merch Swag',
    description: 'Handmade ceramic mug with custom Earl Grey reading blend.',
    estimatedValueUsd: 25.00,
    icon: '☕',
    color: '#9d4edd'
  }
];

export const MOCK_ELIGIBLE_CHATTERS = [
  'FrodoBagEnd',
  'NovelScholar',
  'GrimNarrator',
  'BookWorm_42',
  'LillysNumberOneFan',
  'CosmereSeeker',
  'AragornStrider',
  'ElvenScribe',
  'DuneWanderer',
  'KvotheTheBloodless',
  'MistbornHero'
];
