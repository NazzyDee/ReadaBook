export interface AwardNominee {
  id: string;
  category: string; // e.g. "Streamer of the Year", "Best Audiobook Voice Actor", "Debut Author Spotlight"
  nomineeName: string;
  bookTitleOrChannel: string;
  votesCount: number;
  hasUserVoted: boolean;
}

export const DEFAULT_AWARD_NOMINEES: AwardNominee[] = [
  {
    id: 'nom_streamer_nazzy',
    category: 'Streamer of the Year',
    nomineeName: 'NazzyDee',
    bookTitleOrChannel: 'The Tolkien Book Club',
    votesCount: 14920,
    hasUserVoted: true
  },
  {
    id: 'nom_streamer_elena',
    category: 'Streamer of the Year',
    nomineeName: 'Elena Rostova',
    bookTitleOrChannel: 'Classics with Elena',
    votesCount: 11400,
    hasUserVoted: false
  },
  {
    id: 'nom_voice_marcus',
    category: 'Best Live Voice Acting & Dramatic Performance',
    nomineeName: 'Marcus Vance',
    bookTitleOrChannel: 'The Cyberpunk Chronicles',
    votesCount: 8930,
    hasUserVoted: false
  }
];
