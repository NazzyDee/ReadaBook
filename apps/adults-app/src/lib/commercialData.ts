export interface IntermissionDurationOption {
  seconds: number;
  label: string;
  preRollSnoozeMins: number;
}

export const INTERMISSION_DURATION_OPTIONS: IntermissionDurationOption[] = [
  { seconds: 30, label: '30 Seconds (Quick Sip)', preRollSnoozeMins: 10 },
  { seconds: 60, label: '60 Seconds (Tea Refill)', preRollSnoozeMins: 20 },
  { seconds: 90, label: '90 Seconds (Comfort Break)', preRollSnoozeMins: 30 },
  { seconds: 180, label: '3 Minutes (Full Chapter Pause)', preRollSnoozeMins: 60 }
];

export interface PublisherSponsorAd {
  id: string;
  publisherName: string;
  bookTitle: string;
  discountCode: string;
  bannerUrl: string;
  description: string;
}

export const MOCK_PUBLISHER_SPONSORS: PublisherSponsorAd[] = [
  {
    id: 'ad_tor_fantasy',
    publisherName: 'Tor Books',
    bookTitle: 'Wind and Truth by Brandon Sanderson',
    discountCode: 'READABOOK20',
    bannerUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    description: 'Pre-order the explosive conclusion to the first Stormlight Archive arc with exclusive art prints.'
  },
  {
    id: 'ad_harper_voyager',
    publisherName: 'Harper Voyager',
    bookTitle: 'The Silmarillion Illustrated Edition',
    discountCode: 'LILLYREADS15',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    description: 'Experience Middle-earth lore illustrated in full-color paintings by J.R.R. Tolkien himself.'
  }
];
