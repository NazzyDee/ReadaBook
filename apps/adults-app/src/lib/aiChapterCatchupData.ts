export interface StoryBulletPoint {
  timestampMinutesAgo: number;
  characterInvolved: string;
  summarySentence: string;
  spoilerSeverity: 'LOW' | 'MEDIUM' | 'MAJOR_TWIST';
}

export interface ChapterCatchupSummary {
  chapterNumber: number;
  chapterTitle: string;
  streamStartTime: string;
  tldrParagraph: string;
  keyEvents: StoryBulletPoint[];
}

export const DEFAULT_CATCHUP_SUMMARY: ChapterCatchupSummary = {
  chapterNumber: 15,
  chapterTitle: 'The Council of Elrond: The Fate of the Ring',
  streamStartTime: 'Live for 1h 42m',
  tldrParagraph: 'The council debated the history of the One Ring, rejected sending it across the Sea to Valinor, and Frodo volunteered to carry it to Mount Doom in Mordor.',
  keyEvents: [
    {
      timestampMinutesAgo: 45,
      characterInvolved: 'Boromir of Gondor',
      summarySentence: 'Proposed using the Ring as a weapon against Sauron; rejected by Elrond.',
      spoilerSeverity: 'LOW'
    },
    {
      timestampMinutesAgo: 22,
      characterInvolved: 'Aragorn & Legolas',
      summarySentence: 'Revealed Aragorn\'s true lineage as the Heir of Isildur and King of Gondor.',
      spoilerSeverity: 'MEDIUM'
    },
    {
      timestampMinutesAgo: 5,
      characterInvolved: 'Frodo Baggins',
      summarySentence: 'Declared: "I will take the Ring, though I do not know the way."',
      spoilerSeverity: 'MAJOR_TWIST'
    }
  ]
};
