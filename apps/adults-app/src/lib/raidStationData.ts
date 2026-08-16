export interface RaidTargetStreamer {
  id: string;
  name: string;
  avatarUrl: string;
  currentBook: string;
  genre: string;
  currentChapter: string;
  currentPage: number;
  viewersCount: number;
  isMutualFollow: boolean;
  raidChantMessage: string;
}

export const MOCK_RAID_TARGETS: RaidTargetStreamer[] = [
  {
    id: 'stream_novelscholar',
    name: 'NovelScholar',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    currentBook: 'Dune: Messiah',
    genre: 'Sci-Fi Classic',
    currentChapter: 'Chapter 8: The Conspiracy',
    currentPage: 114,
    viewersCount: 420,
    isMutualFollow: true,
    raidChantMessage: '📖⚔️ LILLY READS BOOK RAID INCOMING! SHIELD UP AND TURN THE PAGE! 📖⚔️'
  },
  {
    id: 'stream_grimnarrator',
    name: 'GrimNarrator',
    avatarUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=200&q=80',
    currentBook: 'Dracula',
    genre: 'Gothic Horror',
    currentChapter: 'Jonathan Harker’s Journal (Ch. 4)',
    currentPage: 62,
    viewersCount: 285,
    isMutualFollow: true,
    raidChantMessage: '🧛🩸 BLOOD & INK BOOK RAID! GREETINGS FROM LILLY’S COVEN! 🧛🩸'
  },
  {
    id: 'stream_fantasybard',
    name: 'FantasyBard',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    currentBook: 'The Name of the Wind',
    genre: 'High Fantasy',
    currentChapter: 'Chapter 22: Distant Music',
    currentPage: 198,
    viewersCount: 890,
    isMutualFollow: false,
    raidChantMessage: '✨📚 TAVERN HARP RAID! PASS THE ALE AND READ ON! ✨📚'
  }
];
