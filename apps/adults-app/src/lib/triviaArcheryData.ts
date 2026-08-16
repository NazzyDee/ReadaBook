export interface ArcheryTargetRing {
  ringName: 'BULLSEYE' | 'GOLD_RING' | 'BLUE_RING' | 'WHITE_RING';
  points: number;
  triviaAnswer: string;
  isCorrect: boolean;
  votesCount: number;
}

export interface ArcheryTriviaRound {
  id: string;
  question: string;
  targetRings: ArcheryTargetRing[];
  timeRemainingSec: number;
  totalArrowsShot: number;
}

export const DEFAULT_ARCHERY_ROUND: ArcheryTriviaRound = {
  id: 'archery_01',
  question: 'What is the name of the sword forged from the shards of Narsil?',
  targetRings: [
    { ringName: 'BULLSEYE', points: 100, triviaAnswer: 'Andúril, Flame of the West', isCorrect: true, votesCount: 340 },
    { ringName: 'GOLD_RING', points: 50, triviaAnswer: 'Glamdring the Foe-Hammer', isCorrect: false, votesCount: 45 },
    { ringName: 'BLUE_RING', points: 25, triviaAnswer: 'Sting, Elven Dagger', isCorrect: false, votesCount: 12 },
    { ringName: 'WHITE_RING', points: 10, triviaAnswer: 'Orcrist the Goblin-Cleaver', isCorrect: false, votesCount: 8 }
  ],
  timeRemainingSec: 25,
  totalArrowsShot: 405
};
