export interface CharityMilestone {
  id: string;
  amountTarget: number;
  title: string;
  rewardDescription: string;
  isUnlocked: boolean;
  icon: string;
}

export interface DonorEntry {
  id: string;
  username: string;
  amount: number;
  message: string;
  timestamp: string;
}

export interface CharityCampaign {
  id: string;
  charityName: string;
  charityLogo: string;
  mission: string;
  currentAmount: number;
  goalAmount: number;
  donorCount: number;
  milestones: CharityMilestone[];
  recentDonations: DonorEntry[];
}

export const ACTIVE_CHARITY_CAMPAIGN: CharityCampaign = {
  id: 'campaign_firstbook_2026',
  charityName: 'First Book & Global Literacy Fund',
  charityLogo: '📚',
  mission: 'Providing brand-new, high-quality books and educational resources to children and community libraries in need.',
  currentAmount: 3850,
  goalAmount: 5000,
  donorCount: 248,
  milestones: [
    {
      id: 'm1',
      amountTarget: 1000,
      title: 'Voice Acting Challenge',
      rewardDescription: 'Streamer reads Chapter 4 completely in a raspy Gollum voice.',
      isUnlocked: true,
      icon: '🎙️'
    },
    {
      id: 'm2',
      amountTarget: 2500,
      title: 'Live Acoustic Soundscapes',
      rewardDescription: 'Streamer plays authentic Celtic harp ambient melodies during the elf city scenes.',
      isUnlocked: true,
      icon: '🎶'
    },
    {
      id: 'm3',
      amountTarget: 5000,
      title: '24-Hour Squad Marathon & Odyssey XP Boost',
      rewardDescription: 'A 24-hour non-stop squad readathon + 5,000 bonus Odyssey Pass XP for all active viewers!',
      isUnlocked: false,
      icon: '🔥'
    },
    {
      id: 'm4',
      amountTarget: 7500,
      title: 'Community Book Printing Grant',
      rewardDescription: 'Funding 1,000 paperback fantasy books for underserved public elementary schools.',
      isUnlocked: false,
      icon: '🏫'
    }
  ],
  recentDonations: [
    {
      id: 'd1',
      username: 'BookElf_99',
      amount: 100,
      message: 'May literacy light every corner of the world! Keep reading!',
      timestamp: '2m ago'
    },
    {
      id: 'd2',
      username: 'LillyReadsFan',
      amount: 50,
      message: 'Happy to support First Book! Loved the Gandalf voice acting!',
      timestamp: '5m ago'
    },
    {
      id: 'd3',
      username: 'NovelScholar',
      amount: 25,
      message: 'Books changed my childhood. Let’s hit the $5k goal!',
      timestamp: '12m ago'
    },
    {
      id: 'd4',
      username: 'RivendellPatron',
      amount: 150,
      message: 'For the children and the love of Tolkien! 🐉',
      timestamp: '24m ago'
    }
  ]
};
