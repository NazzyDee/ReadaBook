export interface HighlightClipItem {
  id: string;
  title: string;
  durationSeconds: number;
  chapterLabel: string;
  thumbnailUrl: string;
  viewCount: number;
  highlightType: 'DRAMATIC_CLIMAX' | 'FUNNY_BLOOPER' | 'EPIC_TWIST' | 'LORE_REVEAL';
}

export const MOCK_HIGHLIGHT_CLIPS: HighlightClipItem[] = [
  {
    id: 'clip_1',
    title: 'The Dragon Awakens - Deep Roar Narration',
    durationSeconds: 45,
    chapterLabel: 'Chapter 12: Inside Information',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    viewCount: 14200,
    highlightType: 'DRAMATIC_CLIMAX'
  },
  {
    id: 'clip_2',
    title: 'Riddles in the Dark - Gollum Voice Impression',
    durationSeconds: 58,
    chapterLabel: 'Chapter 5: Riddles in the Dark',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    viewCount: 9800,
    highlightType: 'EPIC_TWIST'
  },
  {
    id: 'clip_3',
    title: 'Chat CYOA Choice Goes Completely Wrong',
    durationSeconds: 32,
    chapterLabel: 'Chapter 8: Flies and Spiders',
    thumbnailUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&auto=format&fit=crop&q=80',
    viewCount: 6500,
    highlightType: 'FUNNY_BLOOPER'
  }
];
