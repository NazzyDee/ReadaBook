export interface AuctionItem {
  id: string;
  title: string;
  authorOrEdition: string;
  description: string;
  imageUrl: string;
  startingBidSparks: number;
  currentBidSparks: number;
  highestBidder: string;
  highestBidderAvatar: string;
  secondsRemaining: number;
  bidCount: number;
  isSignedEdition: boolean;
}

export const ACTIVE_COMMUNITY_AUCTION: AuctionItem = {
  id: 'auc_signed_lotr_1st',
  title: 'The Hobbit (Collector’s Gold Foil Hardcover)',
  authorOrEdition: 'Signed by Narrator & Certified Archivist Hologram',
  description: 'Limited edition archival volume with hand-marbled endpapers, gold ribbon bookmark, and custom author foreword.',
  imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
  startingBidSparks: 5000,
  currentBidSparks: 18500,
  highestBidder: 'GrandArchivist_Dan',
  highestBidderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&auto=format&fit=crop&q=80',
  secondsRemaining: 48,
  bidCount: 23,
  isSignedEdition: true
};
