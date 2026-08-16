export interface ClipTemplate {
  id: string;
  name: string;
  aspectRatio: '16:9' | '9:16';
  subtitleStyle: 'karaoke-glow' | 'minimalist' | 'classic-serif';
  previewImageUrl: string;
}

export const MOCK_CLIP_TEMPLATES: ClipTemplate[] = [
  {
    id: 'tiktok_viral',
    name: 'TikTok / Shorts Vertical (9:16)',
    aspectRatio: '9:16',
    subtitleStyle: 'karaoke-glow',
    previewImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'youtube_cinematic',
    name: 'YouTube Cinematic Highlight (16:9)',
    aspectRatio: '16:9',
    subtitleStyle: 'classic-serif',
    previewImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80'
  }
];

export interface ClipEditorState {
  title: string;
  bookTitle: string;
  chapterTitle: string;
  startTimeSec: number;
  endTimeSec: number;
  totalDurationSec: number;
  selectedTemplateId: string;
  includeAuthorAttribution: boolean;
  includeKaraokeSubtitles: boolean;
}

export const DEFAULT_CLIP_STATE: ClipEditorState = {
  title: 'Gandalf vs the Balrog - Chills! 🔥',
  bookTitle: 'The Fellowship of the Ring',
  chapterTitle: 'Chapter 5: The Bridge of Khazad-dûm',
  startTimeSec: 15,
  endTimeSec: 45,
  totalDurationSec: 120,
  selectedTemplateId: 'tiktok_viral',
  includeAuthorAttribution: true,
  includeKaraokeSubtitles: true
};
