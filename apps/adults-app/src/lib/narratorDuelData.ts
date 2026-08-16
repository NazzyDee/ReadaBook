export interface DuelChallenge {
  id: string;
  bookTitle: string;
  sceneTitle: string;
  passageText: string;
  targetDurationSec: number;
  characterA: string;
  characterB: string;
  contenderA: {
    username: string;
    avatarUrl: string;
    score: number;
  };
  contenderB: {
    username: string;
    avatarUrl: string;
    score: number;
  };
}

export const SAMPLE_DUEL: DuelChallenge = {
  id: 'duel-1',
  bookTitle: 'The Two Towers',
  sceneTitle: 'The Taming of Sméagol (Gollum vs Sméagol Debate)',
  characterA: 'Sméagol (Gentle, timid)',
  characterB: 'Gollum (Sinister, treacherous)',
  targetDurationSec: 45,
  passageText: '"Sméagol promised! Nice Master won\'t hurt us. He took the rope off." — "Gollum! He takes the Precious! He will give it to the filthy Thieves, yesss! Sneak! We must choke him while he sleepsss!" — "No, no! Not nice Master!"',
  contenderA: {
    username: 'SarahReads',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    score: 1420
  },
  contenderB: {
    username: 'BookwyrmQueen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    score: 1380
  }
};
