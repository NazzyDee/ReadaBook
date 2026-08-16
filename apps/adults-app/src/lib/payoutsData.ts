export interface PayoutSourceBreakdown {
  category: string;
  amount: number;
  percentage: number;
  icon: string;
}

export interface CreatorEarningsSummary {
  currentBalanceUSD: number;
  payoutThresholdUSD: number;
  nextPayoutDate: string;
  payoutMethod: string;
  isPayoutEligible: boolean;
  totalLifetimeEarnings: number;
  sources: PayoutSourceBreakdown[];
  recentPayoutHistory: {
    id: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Processing' | 'Pending';
    invoiceUrl: string;
  }[];
}

export const MOCK_PAYOUTS_SUMMARY: CreatorEarningsSummary = {
  currentBalanceUSD: 1845.50,
  payoutThresholdUSD: 50.00,
  nextPayoutDate: 'September 15, 2026',
  payoutMethod: 'Stripe Express (•••• 4821)',
  isPayoutEligible: true,
  totalLifetimeEarnings: 14920.00,
  sources: [
    { category: 'Channel Subscriptions (Tier 1/2/3)', amount: 890.00, percentage: 48, icon: '⭐' },
    { category: 'Publisher Sponsored Bounties', amount: 450.00, percentage: 24, icon: '💼' },
    { category: 'Community Gift Sub Bombs', amount: 260.00, percentage: 14, icon: '🎁' },
    { category: 'Audiobook Multi-Stem Licensing', amount: 145.50, percentage: 8, icon: '🎚️' },
    { category: 'Sparks & Bit Cheers', amount: 100.00, percentage: 6, icon: '✨' }
  ],
  recentPayoutHistory: [
    { id: 'pay_aug_2026', date: 'Aug 15, 2026', amount: 2150.00, status: 'Paid', invoiceUrl: '#' },
    { id: 'pay_jul_2026', date: 'Jul 15, 2026', amount: 1840.00, status: 'Paid', invoiceUrl: '#' },
    { id: 'pay_jun_2026', date: 'Jun 15, 2026', amount: 1420.00, status: 'Paid', invoiceUrl: '#' }
  ]
};
