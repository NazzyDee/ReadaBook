export interface BroadcastMoment {
  id: string;
  streamerId: string;
  streamerName: string;
  bookTitle: string;
  bookCoverUrl: string;
  momentTitle: string;
  momentDescription: string;
  badgeIcon: string;
  badgeRarity: 'Rare' | 'Epic' | 'Legendary';
  pageNumber: number;
  timestamp: string;
  claimedByCount: number;
  durationSeconds: number;
}

export const ACTIVE_MOMENT_DEMO: BroadcastMoment = {
  id: 'moment_moria_climax',
  streamerId: 'lillyreads',
  streamerName: 'LillyReads',
  bookTitle: 'The Fellowship of the Ring',
  bookCoverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  momentTitle: 'The Bridge of Khazad-dûm Standoff',
  momentDescription: "Live reading climax: 'You Shall Not Pass!' delivered with full orchestral resonance on Page 340.",
  badgeIcon: '🔥',
  badgeRarity: 'Legendary',
  pageNumber: 340,
  timestamp: 'Live Broadcast • August 2026',
  claimedByCount: 412,
  durationSeconds: 60
};

export const MOCK_USER_CLAIMED_MOMENTS: BroadcastMoment[] = [
  {
    id: 'moment_dune_gom_jabbar',
    streamerId: 'fantasy_guru',
    streamerName: 'FantasyGuru',
    bookTitle: 'Dune',
    bookCoverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    momentTitle: 'The Gom Jabbar Litany Against Fear',
    momentDescription: "Chilled the chat with intense monotone delivery of 'Fear is the mind-killer'.",
    badgeIcon: '🏜️',
    badgeRarity: 'Epic',
    pageNumber: 42,
    timestamp: 'August 12, 2026',
    claimedByCount: 890,
    durationSeconds: 60
  },
  {
    id: 'moment_stormlight_climax',
    streamerId: 'novel_scholar',
    streamerName: 'NovelScholar',
    bookTitle: 'The Way of Kings',
    bookCoverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80',
    momentTitle: '1,000-Page Epic Marathon Completion',
    momentDescription: 'Read the complete finale of The Way of Kings across a 14-hour non-stop squad stream.',
    badgeIcon: '⚡',
    badgeRarity: 'Legendary',
    pageNumber: 1007,
    timestamp: 'August 5, 2026',
    claimedByCount: 1240,
    durationSeconds: 60
  }
];
