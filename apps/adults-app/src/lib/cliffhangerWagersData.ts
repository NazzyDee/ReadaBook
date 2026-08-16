export interface CliffhangerWagerPoll {
  id: string;
  question: string;
  chapterContext: string;
  optionA: {
    label: string;
    multiplier: number;
    totalSparks: number;
    backerCount: number;
  };
  optionB: {
    label: string;
    multiplier: number;
    totalSparks: number;
    backerCount: number;
  };
  totalPoolSparks: number;
  secondsRemaining: number;
  status: 'ACTIVE' | 'RESOLVING' | 'COMPLETED';
}

export const ACTIVE_CLIFFHANGER_WAGER: CliffhangerWagerPoll = {
  id: 'wager_hobbit_ch5',
  question: 'Will Bilbo outsmart Gollum and solve the final riddle?',
  chapterContext: 'Chapter 5: Riddles in the Dark • Deep in the roots of the Misty Mountains',
  optionA: {
    label: '✨ Yes, Bilbo Outsmarts Gollum',
    multiplier: 1.65,
    totalSparks: 14500,
    backerCount: 184
  },
  optionB: {
    label: '👺 No, Gollum Attacks in Anger',
    multiplier: 2.85,
    totalSparks: 8400,
    backerCount: 96
  },
  totalPoolSparks: 22900,
  secondsRemaining: 74,
  status: 'ACTIVE'
};
