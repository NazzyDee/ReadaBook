export interface BrandSponsorshipDeal {
  id: string;
  sponsorName: string;
  brandCategory: 'PUBLISHER' | 'COFFEE_TEA' | 'AUDIO_GEAR' | 'STATIONERY';
  campaignObjective: string;
  payoutBudgetUSD: number;
  deliverablesRequired: string[];
  status: 'OFFER_RECEIVED' | 'ACTIVE_ON_AIR' | 'COMPLETED';
}

export const DEFAULT_BRAND_DEALS: BrandSponsorshipDeal[] = [
  {
    id: 'deal_harper',
    sponsorName: 'HarperCollins Fantasy & Sci-Fi',
    brandCategory: 'PUBLISHER',
    campaignObjective: 'Live First-Chapter Read & Review of The Starlight Dominion',
    payoutBudgetUSD: 1800.00,
    deliverablesRequired: [
      '30-minute live chapter read-along',
      'Chat pinned book giveaway link (!bookdeal)',
      '1x 9:16 vertical recap clip'
    ],
    status: 'ACTIVE_ON_AIR'
  },
  {
    id: 'deal_tea_guild',
    sponsorName: 'Archivist Herbal Teas & Infusions',
    brandCategory: 'COFFEE_TEA',
    campaignObjective: 'Cozy Reading Hour Tea Sip Banner & 15% Viewer Promo Code',
    payoutBudgetUSD: 750.00,
    deliverablesRequired: [
      'On-screen branded mug overlay',
      'Code !TEA15 in chat Nightbot rotation'
    ],
    status: 'OFFER_RECEIVED'
  }
];
