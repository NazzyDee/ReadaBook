export interface LendingRoyaltyStream {
  id: string;
  sourceName: string; // e.g. "Public Library Lending (Libby)", "ReadaBook Stream Royalties", "Educational Classroom Rights"
  totalCheckouts: number;
  royaltyPerCheckoutUSD: number;
  accruedRoyaltyUSD: number;
  lastPayoutDate: string;
}

export interface AuthorRoyaltySummary {
  authorLegalName: string;
  isbnRegistered: string;
  totalLendingRoyaltiesUSD: number;
  digitalStreamsRoyaltiesUSD: number;
  streams: LendingRoyaltyStream[];
}

export const DEFAULT_AUTHOR_ROYALTIES: AuthorRoyaltySummary = {
  authorLegalName: 'Eleanor Vance',
  isbnRegistered: '978-0-395-19395-8',
  totalLendingRoyaltiesUSD: 5420.00,
  digitalStreamsRoyaltiesUSD: 18940.00,
  streams: [
    {
      id: 'src_libby',
      sourceName: 'Public Libraries (Libby / OverDrive Lending Rights)',
      totalCheckouts: 14200,
      royaltyPerCheckoutUSD: 0.25,
      accruedRoyaltyUSD: 3550.00,
      lastPayoutDate: 'August 01, 2026'
    },
    {
      id: 'src_readalong',
      sourceName: 'ReadaBook Live Stream Read-Along Micro-Royalties',
      totalCheckouts: 94000,
      royaltyPerCheckoutUSD: 0.15,
      accruedRoyaltyUSD: 14100.00,
      lastPayoutDate: 'August 15, 2026'
    },
    {
      id: 'src_schools',
      sourceName: 'Educational Classroom & University Syndication',
      totalCheckouts: 2500,
      royaltyPerCheckoutUSD: 0.75,
      accruedRoyaltyUSD: 1875.00,
      lastPayoutDate: 'July 15, 2026'
    }
  ]
};
