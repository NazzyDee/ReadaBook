export interface TranscriptLine {
  id: string;
  timestampSeconds: number;
  timestampFormatted: string;
  speaker: string;
  characterVoice?: string;
  pageNumber: number;
  chapterTitle: string;
  text: string;
  isClimax?: boolean;
}

export interface VodChapter {
  id: string;
  title: string;
  startSeconds: number;
  startPage: number;
  durationFormatted: string;
}

export const MOCK_VOD_CHAPTERS: VodChapter[] = [
  { id: 'c1', title: 'Chapter 1: An Unexpected Party', startSeconds: 0, startPage: 1, durationFormatted: '00:00 - 24:15' },
  { id: 'c2', title: 'Chapter 2: Roast Mutton & The Trolls', startSeconds: 1455, startPage: 32, durationFormatted: '24:15 - 58:40' },
  { id: 'c3', title: 'Chapter 3: A Short Rest in Rivendell', startSeconds: 3520, startPage: 64, durationFormatted: '58:40 - 1:32:10' },
  { id: 'c4', title: 'Chapter 4: Over Hill and Under Hill', startSeconds: 5530, startPage: 88, durationFormatted: '1:32:10 - 2:15:00' }
];

export const MOCK_TRANSCRIPT_LINES: TranscriptLine[] = [
  {
    id: 't1',
    timestampSeconds: 12,
    timestampFormatted: '00:12',
    speaker: 'LillyReads (Narrator)',
    chapterTitle: 'Chapter 1: An Unexpected Party',
    pageNumber: 1,
    text: 'In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell...'
  },
  {
    id: 't2',
    timestampSeconds: 58,
    timestampFormatted: '00:58',
    speaker: 'Bilbo Baggins',
    characterVoice: 'Flustered & Polite',
    chapterTitle: 'Chapter 1: An Unexpected Party',
    pageNumber: 3,
    text: "'Good Morning!' said Bilbo, and he meant it. The sun was shining, and the grass was very green."
  },
  {
    id: 't3',
    timestampSeconds: 125,
    timestampFormatted: '02:05',
    speaker: 'Gandalf the Grey',
    characterVoice: 'Authoritative & Resonant',
    chapterTitle: 'Chapter 1: An Unexpected Party',
    pageNumber: 4,
    text: "'What do you mean?' said Gandalf. 'Do you wish me a good morning, or mean that it is a good morning whether I want it or not?'"
  },
  {
    id: 't4',
    timestampSeconds: 1620,
    timestampFormatted: '27:00',
    speaker: 'William the Troll',
    characterVoice: 'Deep & Grunting',
    chapterTitle: 'Chapter 2: Roast Mutton & The Trolls',
    pageNumber: 38,
    text: "'Mutton yesterday, mutton today, and blimey, if it don't look like mutton again tomorrer!'",
    isClimax: true
  },
  {
    id: 't5',
    timestampSeconds: 3600,
    timestampFormatted: '1:00:00',
    speaker: 'Lord Elrond',
    characterVoice: 'Silvery & Ancient',
    chapterTitle: 'Chapter 3: A Short Rest in Rivendell',
    pageNumber: 68,
    text: "'Stand by the grey stone when the thrush knocks, and the setting sun with the last light of Durin’s Day will shine upon the key-hole.'"
  }
];
