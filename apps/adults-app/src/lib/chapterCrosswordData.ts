export interface CrosswordClue {
  number: number;
  direction: 'ACROSS' | 'DOWN';
  clue: string;
  answer: string;
  solvedBy: string | null;
}

export interface LoreWordleState {
  targetWord: string;
  attempts: string[];
  maxAttempts: number;
  revealedLetters: { [index: number]: string };
}

export const DEFAULT_CROSSWORD_CLUES: CrosswordClue[] = [
  {
    number: 1,
    direction: 'ACROSS',
    clue: 'The golden ring inscribed with fiery elvish script (4 letters)',
    answer: 'RING',
    solvedBy: 'GandalfTheGrey'
  },
  {
    number: 2,
    direction: 'ACROSS',
    clue: 'Giant desert predator attracted by rhythmic thumper footsteps (8 letters)',
    answer: 'SANDWORM',
    solvedBy: null
  },
  {
    number: 3,
    direction: 'DOWN',
    clue: 'Wizard school library keeper cat familiar (7 letters)',
    answer: 'GRIMOIRE',
    solvedBy: 'Bookworm99'
  }
];

export const DEFAULT_WORDLE_STATE: LoreWordleState = {
  targetWord: 'HOBBIT',
  attempts: ['DRAGON', 'WIZARD'],
  maxAttempts: 6,
  revealedLetters: { 0: 'H', 1: 'O', 2: 'B', 3: 'B', 4: 'I', 5: 'T' }
};
