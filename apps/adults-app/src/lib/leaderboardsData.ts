export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatarUrl: string;
  badge: string;
  metricLabel: string;
  metricValue: string;
  isCurrentUser?: boolean;
}

export const MOCK_LEADERBOARDS_DATA: {
  topPatrons: LeaderboardEntry[];
  topSprintReaders: LeaderboardEntry[];
  hallOfFameFinishers: LeaderboardEntry[];
} = {
  topPatrons: [
    { rank: 1, username: 'NovelScholar', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', badge: '👑 Grand Patron', metricLabel: 'Gift Subs', metricValue: '142 Subs' },
    { rank: 2, username: 'GrimNarrator', avatarUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=200&q=80', badge: '🥈 Master Scribe', metricLabel: 'Gift Subs', metricValue: '98 Subs' },
    { rank: 3, username: 'BookWorm_42', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', badge: '🥉 Lore Guardian', metricLabel: 'Gift Subs', metricValue: '65 Subs' },
    { rank: 4, username: 'Brandon_Sanderson_Official', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', badge: '✍️ Author VIP', metricLabel: 'Gift Subs', metricValue: '50 Subs' },
    { rank: 5, username: 'LillysNumberOneFan', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', badge: '⭐ Super Fan', metricLabel: 'Gift Subs', metricValue: '34 Subs' }
  ],
  topSprintReaders: [
    { rank: 1, username: 'GrimNarrator', avatarUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=200&q=80', badge: '⚡ Speed Reader', metricLabel: 'Sprint Pages', metricValue: '1,420 Pages' },
    { rank: 2, username: 'NovelScholar', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', badge: '📖 Deep Focus', metricLabel: 'Sprint Pages', metricValue: '1,180 Pages' },
    { rank: 3, username: 'FantasyBard', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', badge: '📜 Marathoner', metricLabel: 'Sprint Pages', metricValue: '950 Pages' }
  ],
  hallOfFameFinishers: [
    { rank: 1, username: 'NovelScholar', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', badge: '🏆 First to Finish', metricLabel: 'Completed', metricValue: 'August 14, 2026' },
    { rank: 2, username: 'GrimNarrator', avatarUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=200&q=80', badge: '🥈 Second Finisher', metricLabel: 'Completed', metricValue: 'August 15, 2026' }
  ]
};
