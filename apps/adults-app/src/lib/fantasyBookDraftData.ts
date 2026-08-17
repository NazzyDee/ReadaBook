export interface DraftedBookPick {
  id: string;
  bookTitle: string;
  author: string;
  fantasyPoints: number;
  projectedSalesRank: number;
  goodreadsRating: number;
  isDraftedByUser: boolean;
}

export interface FantasyLeagueLeague {
  leagueName: string;
  userTeamName: string;
  currentRank: number;
  totalTeamPoints: number;
  roster: DraftedBookPick[];
}

export const DEFAULT_FANTASY_LEAGUE: FantasyLeagueLeague = {
  leagueName: 'Autumn 2026 High Fantasy & Sci-Fi Championship',
  userTeamName: 'Nazzy\'s Page Turners',
  currentRank: 2,
  totalTeamPoints: 4850,
  roster: [
    {
      id: 'draft_01',
      bookTitle: 'Wind and Truth (Stormlight Archive #5)',
      author: 'Brandon Sanderson',
      fantasyPoints: 1850,
      projectedSalesRank: 1,
      goodreadsRating: 4.88,
      isDraftedByUser: true
    },
    {
      id: 'draft_02',
      bookTitle: 'The Doors of Stone',
      author: 'Patrick Rothfuss',
      fantasyPoints: 1600,
      projectedSalesRank: 2,
      goodreadsRating: 4.75,
      isDraftedByUser: true
    },
    {
      id: 'draft_03',
      bookTitle: 'The Winds of Winter',
      author: 'George R.R. Martin',
      fantasyPoints: 1400,
      projectedSalesRank: 3,
      goodreadsRating: 4.70,
      isDraftedByUser: true
    }
  ]
};
