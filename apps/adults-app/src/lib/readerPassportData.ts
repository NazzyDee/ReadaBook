export interface PassportBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number; // 1 - 5
  shelf: 'currently_reading' | 'favorites' | 'want_to_read';
  streamerRecommended?: string;
  pagesRead: number;
  totalPages: number;
}

export interface ReaderPassportProfile {
  username: string;
  avatarUrl: string;
  bio: string;
  memberSince: string;
  yearlyGoal: {
    target: number;
    completed: number;
  };
  totalMinutesListened: number;
  totalSprintPages: number;
  unlockedBadges: { id: string; name: string; icon: string; description: string }[];
  books: PassportBook[];
  isGoodreadsLinked: boolean;
  isStoryGraphLinked: boolean;
}

export const SAMPLE_PASSPORT: ReaderPassportProfile = {
  username: 'SarahReads',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  bio: 'High fantasy lover, Tolkien scholar, and community stream host. Reading one chapter a day.',
  memberSince: 'March 2024',
  yearlyGoal: {
    target: 50,
    completed: 24
  },
  totalMinutesListened: 14820,
  totalSprintPages: 3840,
  unlockedBadges: [
    { id: 'b1', name: 'Grand Lore Master', icon: '👑', description: 'Won 5 Book Battle Royale Tournaments' },
    { id: 'b2', name: 'Speed Sprinter', icon: '⚡', description: 'Completed 50 Pomodoro Silent Sprints' },
    { id: 'b3', name: 'Fellowship Host', icon: '🧝', description: 'Hosted 20 Live Book Club Stages' },
    { id: 'b4', name: 'Odyssey Pioneer', icon: '🏆', description: 'Reached Tier 50 in Odyssey Pass Season 3' }
  ],
  books: [
    {
      id: 'pb-1',
      title: 'The Fellowship of the Ring',
      author: 'J.R.R. Tolkien',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      shelf: 'currently_reading',
      streamerRecommended: 'SarahReads',
      pagesRead: 245,
      totalPages: 423
    },
    {
      id: 'pb-2',
      title: 'Dune Messiah',
      author: 'Frank Herbert',
      coverUrl: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      shelf: 'favorites',
      streamerRecommended: 'ArrakisScholar',
      pagesRead: 336,
      totalPages: 336
    },
    {
      id: 'pb-3',
      title: 'Words of Radiance',
      author: 'Brandon Sanderson',
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      shelf: 'want_to_read',
      streamerRecommended: 'CosmereKnight',
      pagesRead: 0,
      totalPages: 1088
    }
  ],
  isGoodreadsLinked: true,
  isStoryGraphLinked: true
};
