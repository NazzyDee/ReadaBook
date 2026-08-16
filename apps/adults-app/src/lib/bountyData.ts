export interface PublisherBounty {
  id: string;
  publisherName: string;
  publisherLogo: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl: string;
  genre: string;
  payoutAmount: number;
  xpReward: number;
  requiredReadPages: number;
  requiredStreamMinutes: number;
  currentPagesRead: number;
  currentMinutesStreamed: number;
  status: 'available' | 'in_progress' | 'completed' | 'claimed';
  expiresInDays: number;
  deliverables: string[];
}

export const PUBLISHER_BOUNTIES: PublisherBounty[] = [
  {
    id: 'bounty_tor_wind_truth',
    publisherName: 'Tor Books / Macmillan',
    publisherLogo: '🦅',
    bookTitle: 'Wind and Truth',
    bookAuthor: 'Brandon Sanderson',
    bookCoverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    genre: 'Epic Fantasy',
    payoutAmount: 650,
    xpReward: 1500,
    requiredReadPages: 120,
    requiredStreamMinutes: 90,
    currentPagesRead: 120,
    currentMinutesStreamed: 90,
    status: 'completed',
    expiresInDays: 5,
    deliverables: [
      'Read Chapters 1 through 3 live on broadcast',
      'Display official Tor preorder overlay banner for 45+ minutes',
      'Host 10-minute live community lore prediction discussion'
    ]
  },
  {
    id: 'bounty_orbit_space_opera',
    publisherName: 'Orbit Books',
    publisherLogo: '🪐',
    bookTitle: 'The Mercy of Gods',
    bookAuthor: 'James S.A. Corey',
    bookCoverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    genre: 'Science Fiction',
    payoutAmount: 450,
    xpReward: 1000,
    requiredReadPages: 80,
    requiredStreamMinutes: 60,
    currentPagesRead: 45,
    currentMinutesStreamed: 35,
    status: 'in_progress',
    expiresInDays: 8,
    deliverables: [
      'Read the introductory space fleet encounter live',
      'Mention release date in chat pinned message',
      'Share custom affiliate purchase link in chat'
    ]
  },
  {
    id: 'bounty_penguin_gothic',
    publisherName: 'Penguin Random House',
    publisherLogo: '🐧',
    bookTitle: 'The Shadow over Innsmouth (Illustrated)',
    bookAuthor: 'H.P. Lovecraft',
    bookCoverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80',
    genre: 'Gothic Horror',
    payoutAmount: 350,
    xpReward: 800,
    requiredReadPages: 60,
    requiredStreamMinutes: 45,
    currentPagesRead: 0,
    currentMinutesStreamed: 0,
    status: 'available',
    expiresInDays: 14,
    deliverables: [
      'Use Smart Foley & Voice Acting filters during the night chase scene',
      'Tag stream with #PenguinHorrorMarathon',
      'Clip 1 highlight moment to the ReadaBook Discover feed'
    ]
  },
  {
    id: 'bounty_harper_mystery',
    publisherName: 'HarperCollins',
    publisherLogo: '🏛️',
    bookTitle: 'The Murder of Roger Ackroyd',
    bookAuthor: 'Agatha Christie',
    bookCoverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
    genre: 'Mystery & Thriller',
    payoutAmount: 400,
    xpReward: 900,
    requiredReadPages: 75,
    requiredStreamMinutes: 60,
    currentPagesRead: 0,
    currentMinutesStreamed: 0,
    status: 'available',
    expiresInDays: 21,
    deliverables: [
      'Conduct a live audience murder suspect poll before Chapter 10',
      'Display official HarperCollins mystery badge on screen'
    ]
  }
];
