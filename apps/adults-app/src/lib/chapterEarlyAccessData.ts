export interface EarlyAccessChapterDrop {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  wordCount: number;
  minSparksPwyw: number;
  suggestedSparks: number;
  totalKeysClaimed: number;
  publicReleaseDateFormatted: string;
  authorNote: string;
}

export const DEFAULT_CHAPTER_DROPS: EarlyAccessChapterDrop[] = [
  {
    id: 'drop_ch_25',
    chapterNumber: 25,
    chapterTitle: 'The Siege of Helm\'s Deep: Extended Director Cut',
    wordCount: 8400,
    minSparksPwyw: 50,
    suggestedSparks: 250,
    totalKeysClaimed: 412,
    publicReleaseDateFormatted: 'Friday (4 days early)',
    authorNote: 'Includes 12 unpublished battle paragraphs and full orchestral audio stream playback.'
  },
  {
    id: 'drop_ch_26',
    chapterNumber: 26,
    chapterTitle: 'The Road to Isengard (Uncensored)',
    wordCount: 6200,
    minSparksPwyw: 50,
    suggestedSparks: 250,
    totalKeysClaimed: 290,
    publicReleaseDateFormatted: 'Next Monday (7 days early)',
    authorNote: 'Featuring Entish battle chants and Treebeard lore monologue.'
  }
];
