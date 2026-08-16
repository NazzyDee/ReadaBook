export interface ArchivedVod {
  id: string;
  streamTitle: string;
  bookTitle: string;
  broadcastDate: string;
  durationFormatted: string;
  viewCount: number;
  chapterTimestampsCount: number;
  searchableTranscriptTokens: number;
  thumbnailUrl: string;
}

export const DEFAULT_ARCHIVED_VODS: ArchivedVod[] = [
  {
    id: 'vod_lotr_ch12',
    streamTitle: 'Flight to the Ford & The Nazgûl Ambush (Live Reading + Foley)',
    bookTitle: 'The Fellowship of the Ring (Book 1, Ch 12)',
    broadcastDate: 'Yesterday',
    durationFormatted: '2h 45m',
    viewCount: 1840,
    chapterTimestampsCount: 14,
    searchableTranscriptTokens: 24500,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'vod_dune_ch8',
    streamTitle: 'The Gom Jabbar Test & Bene Gesserit Litany Against Fear',
    bookTitle: 'Dune (Book 1, Ch 8)',
    broadcastDate: '3 days ago',
    durationFormatted: '3h 10m',
    viewCount: 3200,
    chapterTimestampsCount: 18,
    searchableTranscriptTokens: 31200,
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80'
  }
];
