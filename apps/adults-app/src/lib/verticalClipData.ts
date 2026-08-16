export interface VerticalClipPreset {
  id: string;
  name: string;
  aspectRatio: '9:16_VERTICAL' | '1:1_SQUARE' | '4:5_PORTRAIT';
  captionStyle: 'KARAOKE_BOUNCE' | 'GILDED_SERIF' | 'MINIMAL_SUBTITLE';
  videoCropMode: 'FACE_AND_BOOK_STACK' | 'FACE_ONLY_FULL' | 'MANUSCRIPT_FOCUS';
  durationSec: number;
}

export const DEFAULT_CLIP_PRESETS: VerticalClipPreset[] = [
  {
    id: 'preset_tiktok_hype',
    name: 'TikTok Viral Climax Stack (Face + Manuscript)',
    aspectRatio: '9:16_VERTICAL',
    captionStyle: 'KARAOKE_BOUNCE',
    videoCropMode: 'FACE_AND_BOOK_STACK',
    durationSec: 45
  },
  {
    id: 'preset_reels_aesthetic',
    name: 'Instagram Reels BookTok Aesthetic',
    aspectRatio: '9:16_VERTICAL',
    captionStyle: 'GILDED_SERIF',
    videoCropMode: 'MANUSCRIPT_FOCUS',
    durationSec: 30
  },
  {
    id: 'preset_youtube_shorts',
    name: 'YouTube Shorts Dramatic Quote Reveal',
    aspectRatio: '9:16_VERTICAL',
    captionStyle: 'KARAOKE_BOUNCE',
    videoCropMode: 'FACE_ONLY_FULL',
    durationSec: 60
  }
];
