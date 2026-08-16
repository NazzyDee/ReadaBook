export interface ChapterMarker {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  pageRange: string;
  timestampSec: number;
  timestampFormatted: string;
  quoteSnippet: string;
  narratorVoiceNote: string;
}

export const MOCK_CHAPTER_MARKERS: ChapterMarker[] = [
  {
    id: 'mark_01',
    chapterNumber: 1,
    chapterTitle: 'A Long-expected Party',
    pageRange: 'Pages 21 - 48',
    timestampSec: 120,
    timestampFormatted: '00:02:00',
    quoteSnippet: '“When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday...”',
    narratorVoiceNote: 'Warm, whimsical tavern tone. Added hearth crackle ambiance.'
  },
  {
    id: 'mark_02',
    chapterNumber: 2,
    chapterTitle: 'The Shadow of the Past',
    pageRange: 'Pages 49 - 78',
    timestampSec: 1950,
    timestampFormatted: '00:32:30',
    quoteSnippet: '“One Ring to rule them all, One Ring to find them...”',
    narratorVoiceNote: 'Deepened pitch for Gandalf’s ominous whisper.'
  },
  {
    id: 'mark_03',
    chapterNumber: 3,
    chapterTitle: 'Three is Company',
    pageRange: 'Pages 79 - 110',
    timestampSec: 3720,
    timestampFormatted: '01:02:00',
    quoteSnippet: '“The leaves were falling from the trees, and the light was fading fast...”',
    narratorVoiceNote: 'Added forest night rustle foley.'
  },
  {
    id: 'mark_04',
    chapterNumber: 4,
    chapterTitle: 'A Shortcut to Mushrooms',
    pageRange: 'Pages 111 - 135',
    timestampSec: 5400,
    timestampFormatted: '01:30:00',
    quoteSnippet: '“Black Riders sniffing on the road! Pippin and Merry quicken their pace.”',
    narratorVoiceNote: 'High suspense reading with heavy breathing foley.'
  }
];
