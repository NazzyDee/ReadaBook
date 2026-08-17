export interface PartnerIndieBookstore {
  id: string;
  storeName: string;
  cityCountry: string;
  commissionSplitPct: number;
  totalCopiesSold: number;
  featuredBookTitle: string;
  featuredBookPriceUSD: number;
  affiliateCommissionEarnedUSD: number;
}

export const DEFAULT_INDIE_STORES: PartnerIndieBookstore[] = [
  {
    id: 'store_powells',
    storeName: 'Powell\'s City of Books',
    cityCountry: 'Portland, OR (USA)',
    commissionSplitPct: 15,
    totalCopiesSold: 480,
    featuredBookTitle: 'The Fellowship of the Ring (50th Anniversary Hardcover)',
    featuredBookPriceUSD: 35.00,
    affiliateCommissionEarnedUSD: 2520.00
  },
  {
    id: 'store_strand',
    storeName: 'Strand Book Store',
    cityCountry: 'New York, NY (USA)',
    commissionSplitPct: 15,
    totalCopiesSold: 320,
    featuredBookTitle: 'Dune: Deluxe Collector Edition',
    featuredBookPriceUSD: 40.00,
    affiliateCommissionEarnedUSD: 1920.00
  },
  {
    id: 'store_shakespeare',
    storeName: 'Shakespeare and Company',
    cityCountry: 'Paris (France)',
    commissionSplitPct: 15,
    totalCopiesSold: 215,
    featuredBookTitle: 'A Moveable Feast (Restored Edition)',
    featuredBookPriceUSD: 28.00,
    affiliateCommissionEarnedUSD: 903.00
  }
];
