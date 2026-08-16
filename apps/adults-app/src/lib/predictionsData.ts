export interface PredictionOutcome {
  id: string;
  title: string;
  totalPointsStaked: number;
  totalVoters: number;
  ratio: number; // e.g. 1.8x
  color: string;
}

export interface LiteraryPrediction {
  id: string;
  question: string;
  bookTitle: string;
  chapterTitle: string;
  status: 'active' | 'locked' | 'resolved';
  secondsRemaining: number;
  totalPoolPoints: number;
  outcomes: [PredictionOutcome, PredictionOutcome];
  userVote?: {
    outcomeId: string;
    pointsStaked: number;
  };
}

export const DEFAULT_PREDICTION_DATA: LiteraryPrediction = {
  id: 'pred_01',
  question: 'Will Frodo & Sam make it past the Black Gate in today’s stream?',
  bookTitle: 'The Two Towers',
  chapterTitle: 'Book IV, Chapter 3',
  status: 'active',
  secondsRemaining: 180,
  totalPoolPoints: 48500,
  outcomes: [
    {
      id: 'opt_yes',
      title: 'Option A: Yes, they enter Mordor today!',
      totalPointsStaked: 32000,
      totalVoters: 142,
      ratio: 1.5,
      color: '#00ff88'
    },
    {
      id: 'opt_no',
      title: 'Option B: No, Gollum stops them / turns back',
      totalPointsStaked: 16500,
      totalVoters: 84,
      ratio: 2.9,
      color: '#ff3b3b'
    }
  ]
};
