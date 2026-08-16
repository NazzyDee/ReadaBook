export interface MarathonShift {
  timeSlot: string;
  hostName: string;
  hostAvatar: string;
  bookSection: string;
}

export interface ReadingMarathonEvent {
  id: string;
  eventName: string;
  bannerUrl: string;
  organizerName: string;
  bookTitle: string;
  targetPages: number;
  durationHours: number;
  startDateFormatted: string;
  totalRsvps: number;
  shifts: MarathonShift[];
  milestones: { pages: number; reward: string }[];
}

export const UPCOMING_MARATHONS: ReadingMarathonEvent[] = [
  {
    id: 'marathon_cosmere_24h',
    eventName: '24-Hour Cosmere Release Read-A-Thon 🌌',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    organizerName: 'CosmereBookClub',
    bookTitle: 'Wind and Truth by Brandon Sanderson',
    targetPages: 1200,
    durationHours: 24,
    startDateFormatted: 'Saturday, Aug 22 at 12:00 PM EST',
    totalRsvps: 3420,
    shifts: [
      { timeSlot: '12:00 PM - 04:00 PM', hostName: 'LillyReads', hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', bookSection: 'Part 1: Prologue & Ch 1-15' },
      { timeSlot: '04:00 PM - 08:00 PM', hostName: 'FantasyBard', hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', bookSection: 'Part 2: The Shattered Plains' },
      { timeSlot: '08:00 PM - 12:00 AM', hostName: 'LoreMaster_Kai', hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', bookSection: 'Part 3: Urithiru Midnight Climax' }
    ],
    milestones: [
      { pages: 300, reward: 'Unlock Exclusive Cosmere Emote Pack for All Viewers' },
      { pages: 600, reward: 'Live Author Voice Note Playback' },
      { pages: 1200, reward: '50-Book Community Hardcover Giveaway' }
    ]
  }
];
