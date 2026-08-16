export interface HallOfFameRecord {
  rank: number;
  username: string;
  avatarUrl: string;
  metricLabel: string;
  metricValue: string;
  badge: string;
  seasonTitle: string;
}

export const HALL_OF_FAME_RECORDS: Record<'marathon' | 'trivia' | 'patron', HallOfFameRecord[]> = {
  marathon: [
    {
      rank: 1,
      username: 'BookwyrmQueen',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      metricLabel: 'Pages Sprint Read',
      metricValue: '42,910 Pages',
      badge: '👑 Marathon Legend',
      seasonTitle: 'Season 4: The Fellowship'
    },
    {
      rank: 2,
      username: 'SarahReads',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      metricLabel: 'Pages Sprint Read',
      metricValue: '38,450 Pages',
      badge: '🥈 Grand Sprinter',
      seasonTitle: 'Season 4: The Fellowship'
    },
    {
      rank: 3,
      username: 'CosmereKnight',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      metricLabel: 'Pages Sprint Read',
      metricValue: '31,200 Pages',
      badge: '🥉 Endurance Titan',
      seasonTitle: 'Season 4: The Fellowship'
    }
  ],
  trivia: [
    {
      rank: 1,
      username: 'LoreMasterElrond',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      metricLabel: 'Trivia Battle Wins',
      metricValue: '124 Victories',
      badge: '👑 Undefeated Lore God',
      seasonTitle: 'All-Time Champion'
    },
    {
      rank: 2,
      username: 'ArrakisScholar',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
      metricLabel: 'Trivia Battle Wins',
      metricValue: '98 Victories',
      badge: '🥈 Mentat Mastermind',
      seasonTitle: 'All-Time Champion'
    }
  ],
  patron: [
    {
      rank: 1,
      username: 'GildedPagePatron',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      metricLabel: 'Gift Subs Awarded',
      metricValue: '2,450 Subs',
      badge: '👑 Grand Literary Philanthropist',
      seasonTitle: '2026 Patron of the Year'
    },
    {
      rank: 2,
      username: 'BibliophileBenefactor',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      metricLabel: 'Gift Subs Awarded',
      metricValue: '1,890 Subs',
      badge: '🥈 Royal Library Benefactor',
      seasonTitle: '2026 Patron of the Year'
    }
  ]
};
