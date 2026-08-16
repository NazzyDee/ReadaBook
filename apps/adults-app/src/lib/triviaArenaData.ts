export interface TriviaQuestion {
  id: string;
  question: string;
  bookTitle: string;
  chapterTitle: string;
  options: {
    id: string;
    text: string;
    votePercentage: number;
    isCorrect: boolean;
  }[];
  sparksPrizePool: number;
  timeRemainingSeconds: number;
  isAnswerRevealed: boolean;
}

export const SAMPLE_TRIVIA_QUESTION: TriviaQuestion = {
  id: 'triv_01',
  question: 'What was the ancient Elven name of the sword wielded by Gandalf?',
  bookTitle: 'The Hobbit / The Lord of the Rings',
  chapterTitle: 'Rivendell Lore & History',
  options: [
    { id: 'opt_1', text: 'Orcrist (The Goblin-cleaver)', votePercentage: 18, isCorrect: false },
    { id: 'opt_2', text: 'Glamdring (The Foe-hammer)', votePercentage: 62, isCorrect: true },
    { id: 'opt_3', text: 'Sting (The Spider’s Bane)', votePercentage: 14, isCorrect: false },
    { id: 'opt_4', text: 'Andúril (Flame of the West)', votePercentage: 6, isCorrect: false }
  ],
  sparksPrizePool: 25000,
  timeRemainingSeconds: 15,
  isAnswerRevealed: false
};
