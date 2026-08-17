export interface TriviaRoyaleRound {
  questionNumber: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  playersRemaining: number;
  timeLimitSeconds: number;
  prizePoolSparks: number;
}

export const DEFAULT_TRIVIA_ROYALE: TriviaRoyaleRound = {
  questionNumber: 8,
  questionText: 'In "The Hobbit", what was the name of Bilbo Baggins\'s mother?',
  options: [
    'Belladonna Took',
    'Primula Brandybuck',
    'Lobelia Sackville-Baggins',
    'Mirabella Took'
  ],
  correctOptionIndex: 0,
  playersRemaining: 184,
  timeLimitSeconds: 15,
  prizePoolSparks: 50000
};
