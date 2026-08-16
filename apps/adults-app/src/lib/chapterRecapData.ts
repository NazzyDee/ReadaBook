export interface ChapterRecapData {
  bookTitle: string;
  currentChapter: string;
  recapBullets: string[];
  keyCharacterStatuses: {
    name: string;
    status: 'Alive & Well' | 'Wounded' | 'Missing / In Hiding' | 'Betrayed';
    statusColor: string;
    location: string;
  }[];
  cliffhangerWarning: string;
  lastUpdatedTime: string;
}

export const MOCK_CHAPTER_RECAP: ChapterRecapData = {
  bookTitle: 'The Hobbit: Chapter 5 - Riddles in the Dark',
  currentChapter: 'Chapter 5: Riddles in the Dark',
  recapBullets: [
    'Bilbo awoke alone in pitch black darkness under the Misty Mountains and stumbled upon a mysterious golden ring.',
    'Gollum approached from the dark subterranean lake and challenged Bilbo to a life-or-death riddle game.',
    'Bilbo asked his final desperate riddle: “What have I got in my pocket?”, leaving Gollum furious and suspicious.',
    'Bilbo discovered the ring makes him invisible, narrowly escaping Gollum through the goblins’ lower exit.'
  ],
  keyCharacterStatuses: [
    {
      name: 'Bilbo Baggins',
      status: 'Alive & Well',
      statusColor: '#00ff88',
      location: 'Misty Mountains Lower Pass (Invisible)'
    },
    {
      name: 'Gandalf & Dwarves',
      status: 'Missing / In Hiding',
      statusColor: '#ffd700',
      location: 'East Side of the Mountains (Escaping Wargs)'
    },
    {
      name: 'Gollum',
      status: 'Wounded',
      statusColor: '#ff8c00',
      location: 'Subterranean Lake Island'
    }
  ],
  cliffhangerWarning: '⚠️ Major Climax Ahead: Warg pack howling heard in the pine forest.',
  lastUpdatedTime: '2 mins ago (Live Synchronized)'
};
