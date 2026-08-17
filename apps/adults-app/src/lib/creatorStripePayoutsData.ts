export interface CreatorPayoutSummary {
  sparksBalance: number;
  availableUSD: number;
  pendingUSD: number;
  lifetimeEarningsUSD: number;
  stripeConnectedAccount: string;
  payoutSchedule: 'DAILY_AUTO' | 'WEEKLY_FRIDAY' | 'MANUAL_ON_DEMAND';
  recentPayouts: { id: string; amountUSD: number; dateFormatted: string; status: 'PAID' | 'PROCESSING' }[];
}

export const DEFAULT_PAYOUT_SUMMARY: CreatorPayoutSummary = {
  sparksBalance: 345000,
  availableUSD: 3450.00,
  pendingUSD: 420.50,
  lifetimeEarningsUSD: 42890.00,
  stripeConnectedAccount: 'acct_1NZ4928bReadaBook',
  payoutSchedule: 'DAILY_AUTO',
  recentPayouts: [
    { id: 'po_01', amountUSD: 1250.00, dateFormatted: 'August 14, 2026', status: 'PAID' },
    { id: 'po_02', amountUSD: 890.00, dateFormatted: 'August 10, 2026', status: 'PAID' },
    { id: 'po_03', amountUSD: 420.50, dateFormatted: 'August 07, 2026', status: 'PAID' }
  ]
};
