export interface ChapterRetentionMetric {
  chapterNumber: number;
  chapterTitle: string;
  retentionPercent: number; // e.g. 96
  avgListenMinutes: number;
  rewindSpikesCount: number;
}

export interface BookSalesMetric {
  format: string;
  unitsSold: number;
  grossRevenue: number;
  creatorCommission: number;
  storeSource: string;
}

export interface CreatorInsightsReport {
  streamerId: string;
  streamerName: string;
  totalLiveHours: number;
  totalUniqueListeners: number;
  avgConcurrentViewers: number;
  totalPagesStreamed: number;
  totalAffiliateEarnings: number;
  chapterRetention: ChapterRetentionMetric[];
  bookSales: BookSalesMetric[];
  sprintMinutesLogged: number;
  communityPagesLogged: number;
  topAudienceReaders: { username: string; avatarUrl: string; pagesRead: number; sprintsCompleted: number }[];
}

export const MOCK_CREATOR_INSIGHTS: CreatorInsightsReport = {
  streamerId: 'sarah_books',
  streamerName: 'SarahReads',
  totalLiveHours: 148.5,
  totalUniqueListeners: 42800,
  avgConcurrentViewers: 1850,
  totalPagesStreamed: 2460,
  totalAffiliateEarnings: 1486.50,
  chapterRetention: [
    { chapterNumber: 1, chapterTitle: 'A Long-expected Party', retentionPercent: 100, avgListenMinutes: 45, rewindSpikesCount: 140 },
    { chapterNumber: 2, chapterTitle: 'The Shadow of the Past', retentionPercent: 96, avgListenMinutes: 52, rewindSpikesCount: 320 },
    { chapterNumber: 3, chapterTitle: 'Three is Company', retentionPercent: 93, avgListenMinutes: 48, rewindSpikesCount: 110 },
    { chapterNumber: 4, chapterTitle: 'A Short Cut to Mushrooms', retentionPercent: 91, avgListenMinutes: 42, rewindSpikesCount: 95 },
    { chapterNumber: 5, chapterTitle: 'A Conspiracy Unmasked', retentionPercent: 95, avgListenMinutes: 50, rewindSpikesCount: 240 },
    { chapterNumber: 6, chapterTitle: 'The Old Forest', retentionPercent: 88, avgListenMinutes: 44, rewindSpikesCount: 180 },
    { chapterNumber: 7, chapterTitle: 'In the House of Tom Bombadil', retentionPercent: 97, avgListenMinutes: 58, rewindSpikesCount: 450 }
  ],
  bookSales: [
    { format: 'Hardcover Collector Edition', unitsSold: 142, grossRevenue: 3832.58, creatorCommission: 383.26, storeSource: 'Bookshop.org (Indie Bookstores)' },
    { format: 'Trade Paperback', unitsSold: 285, grossRevenue: 4557.15, creatorCommission: 455.72, storeSource: 'Bookshop.org (Indie Bookstores)' },
    { format: 'Kindle / E-Pub Edition', unitsSold: 390, grossRevenue: 3896.10, creatorCommission: 389.61, storeSource: 'Amazon Kindle' },
    { format: 'ReadaBook Master Audio (M4B)', unitsSold: 136, grossRevenue: 2582.64, creatorCommission: 258.26, storeSource: 'ReadaBook Master Store' }
  ],
  sprintMinutesLogged: 18640,
  communityPagesLogged: 12450,
  topAudienceReaders: [
    { username: 'LothlorienScholar', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', pagesRead: 480, sprintsCompleted: 32 },
    { username: 'BookwyrmQueen', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', pagesRead: 425, sprintsCompleted: 28 },
    { username: 'RangerStrider', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', pagesRead: 390, sprintsCompleted: 25 },
    { username: 'CozyReader99', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', pagesRead: 340, sprintsCompleted: 22 }
  ]
};
