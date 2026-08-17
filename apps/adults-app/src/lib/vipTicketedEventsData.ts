export interface VipTicketTier {
  id: string;
  tierName: string;
  ticketPriceUSD: number;
  perksIncluded: string[];
  totalTicketsSold: number;
  maxCap: number;
}

export interface VipLiveEvent {
  id: string;
  eventTitle: string;
  eventDateFormatted: string;
  guestAuthorName: string;
  totalRevenueUSD: number;
  tiers: VipTicketTier[];
}

export const DEFAULT_VIP_EVENT: VipLiveEvent = {
  id: 'vip_event_sanderson',
  eventTitle: 'Cosmere Spoilers & Worldbuilding Masterclass with Guest Star',
  eventDateFormatted: 'Saturday, August 22, 2026 @ 8:00 PM EST',
  guestAuthorName: 'Brandon Sanderson',
  totalRevenueUSD: 14500.00,
  tiers: [
    {
      id: 'tier_general_qa',
      tierName: 'General Live Q&A Stage Access',
      ticketPriceUSD: 15.00,
      perksIncluded: ['Direct text question submission in priority chat queue', 'HD replay recording VOD'],
      totalTicketsSold: 650,
      maxCap: 1000
    },
    {
      id: 'tier_backstage_mic',
      tierName: 'Backstage VIP Audio Hot-Seat Pass',
      ticketPriceUSD: 75.00,
      perksIncluded: ['Live 2-minute voice mic question directly on stream', 'Signed digital certificate & exclusive badge'],
      totalTicketsSold: 25,
      maxCap: 30
    }
  ]
};
