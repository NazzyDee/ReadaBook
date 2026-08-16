export interface GiveawayItem {
  id: string;
  title: string;
  itemDescription: string;
  sponsorName: string;
  eligibleViewersCount: number;
  winnerUsername: string | null;
}

export const DEFAULT_GIVEAWAYS: GiveawayItem[] = [
  {
    id: 'giveaway_leather_lotr',
    title: 'Signed Leather-Bound Lord of the Rings 70th Anniversary Edition',
    itemDescription: 'Full foil-embossed hardcover with gilded edges, parchment fold-out maps, and narrator wax signature.',
    sponsorName: 'HarperCollins Publishers',
    eligibleViewersCount: 248,
    winnerUsername: null
  },
  {
    id: 'giveaway_wax_seal_kit',
    title: 'Custom Narrator Dragon Wax Seal & Ink Quill Kit',
    itemDescription: 'Heavy brass seal stamp with gold, crimson and emerald wax sticks in a velvet keepsake box.',
    sponsorName: 'Archivist Guild Merch',
    eligibleViewersCount: 312,
    winnerUsername: 'ElvenScribe_99'
  }
];
