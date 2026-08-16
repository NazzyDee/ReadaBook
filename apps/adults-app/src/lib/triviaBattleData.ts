export interface TriviaQuestion {
  id: string;
  bookTitle: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  timeLimitSec: number;
}

export interface BattleParticipant {
  id: string;
  username: string;
  avatarUrl: string;
  score: number;
  streak: number;
  isEliminated: boolean;
  selectedOption: number | null;
}

export const SAMPLE_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 'q1',
    bookTitle: 'The Fellowship of the Ring',
    question: 'What is the elvish word for "friend" spoken to open the West-gate of Moria?',
    options: ['Mellon', 'Namarie', 'Elen', 'Mithrandir'],
    correctIndex: 0,
    explanation: 'Gandalf realized the inscription meant "Speak, friend, and enter" — the Sindarin word for friend is "Mellon".',
    timeLimitSec: 15
  },
  {
    id: 'q2',
    bookTitle: 'The Fellowship of the Ring',
    question: 'Which blade did Bilbo bestow upon Frodo in Rivendell?',
    options: ['Glamdring', 'Sting', 'Narsil', 'Orcrist'],
    correctIndex: 1,
    explanation: 'Bilbo gave Frodo "Sting", an elven short-sword from Gondolin that glows blue when orcs are near.',
    timeLimitSec: 15
  },
  {
    id: 'q3',
    bookTitle: 'The Fellowship of the Ring',
    question: 'Who was the oldest living being in Middle-earth encountered in the Old Forest?',
    options: ['Treebeard', 'Tom Bombadil', 'Radagast', 'Celeborn'],
    correctIndex: 1,
    explanation: 'Tom Bombadil describes himself as "Eldest, that\'s what I am. Tom was here before the river and the trees."',
    timeLimitSec: 15
  },
  {
    id: 'q4',
    bookTitle: 'The Fellowship of the Ring',
    question: 'How many members made up the Company of the Fellowship of the Ring?',
    options: ['Seven', 'Eight', 'Nine', 'Twelve'],
    correctIndex: 2,
    explanation: 'Nine companions were chosen to represent the Free Peoples of Middle-earth, matching the Nine Nazgûl.',
    timeLimitSec: 15
  },
  {
    id: 'q5',
    bookTitle: 'The Fellowship of the Ring',
    question: 'What gift did Lady Galadriel bestow upon Gimli the dwarf at Lothlórien?',
    options: ['A golden ring', 'Three strands of her golden hair', 'A jewel-encrusted axe', 'A cloak of elven weave'],
    correctIndex: 1,
    explanation: 'Gimli humbly requested a single strand of Galadriel\'s golden hair; she gave him three strands in honor of his devotion.',
    timeLimitSec: 15
  }
];

export const INITIAL_BATTLE_BOTS: BattleParticipant[] = [
  {
    id: 'p1',
    username: 'BookwyrmQueen',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    score: 340,
    streak: 3,
    isEliminated: false,
    selectedOption: null
  },
  {
    id: 'p2',
    username: 'LothlorienScholar',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    score: 280,
    streak: 2,
    isEliminated: false,
    selectedOption: null
  },
  {
    id: 'p3',
    username: 'RangerStrider',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    score: 220,
    streak: 1,
    isEliminated: false,
    selectedOption: null
  },
  {
    id: 'p4',
    username: 'CozyReader99',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    score: 190,
    streak: 0,
    isEliminated: false,
    selectedOption: null
  }
];
