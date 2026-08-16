export interface TournamentMatchup {
  matchId: string;
  roundName: string;
  bookATitle: string;
  bookAAuthor: string;
  bookAVotes: number;
  bookBTitle: string;
  bookBAuthor: string;
  bookBVotes: number;
  winnerId: 'A' | 'B' | null;
}

export const DEFAULT_TOURNAMENT_MATCHUPS: TournamentMatchup[] = [
  {
    matchId: 'match_semi_1',
    roundName: 'Semi-Finals: High Fantasy Clash',
    bookATitle: 'The Fellowship of the Ring',
    bookAAuthor: 'J.R.R. Tolkien',
    bookAVotes: 1420,
    bookBTitle: 'The Name of the Wind',
    bookBAuthor: 'Patrick Rothfuss',
    bookBVotes: 980,
    winnerId: 'A'
  },
  {
    matchId: 'match_semi_2',
    roundName: 'Semi-Finals: Sci-Fi & Lore',
    bookATitle: 'Dune (Book 1)',
    bookAAuthor: 'Frank Herbert',
    bookAVotes: 1150,
    bookBTitle: 'Hyperion',
    bookBAuthor: 'Dan Simmons',
    bookBVotes: 820,
    winnerId: 'A'
  },
  {
    matchId: 'match_grand_finals',
    roundName: '🏆 Grand Championship Final',
    bookATitle: 'The Fellowship of the Ring',
    bookAAuthor: 'J.R.R. Tolkien',
    bookAVotes: 3100,
    bookBTitle: 'Dune (Book 1)',
    bookBAuthor: 'Frank Herbert',
    bookBVotes: 2850,
    winnerId: null
  }
];
