export interface StreamTagItem {
  id: string;
  name: string;
  category: 'MOOD' | 'DELIVERY' | 'GENRE' | 'AUDIENCE';
  description: string;
  popularityCount: number;
  isSelected?: boolean;
}

export const AVAILABLE_STREAM_TAGS: StreamTagItem[] = [
  {
    id: 'tag_dark_fantasy',
    name: 'Dark Fantasy',
    category: 'GENRE',
    description: 'Grim, gritty worlds with high-stakes tension and moral ambiguity.',
    popularityCount: 1420
  },
  {
    id: 'tag_cozy_hearth',
    name: 'Cozy Hearth',
    category: 'MOOD',
    description: 'Warm fireplace ambiance, tea sipping, and relaxing storytelling.',
    popularityCount: 2180
  },
  {
    id: 'tag_full_cast',
    name: 'Full Cast Dramatization',
    category: 'DELIVERY',
    description: 'Multiple co-readers voicing distinct characters.',
    popularityCount: 950
  },
  {
    id: 'tag_character_accents',
    name: 'Character Accents',
    category: 'DELIVERY',
    description: 'Distinct dialects and voice acting for each cast member.',
    popularityCount: 1870
  },
  {
    id: 'tag_asmr_whisper',
    name: 'ASMR Reading',
    category: 'DELIVERY',
    description: 'Soft whispery microphone cadence for sleep and relaxation.',
    popularityCount: 1340
  },
  {
    id: 'tag_unabridged',
    name: 'Unabridged',
    category: 'AUDIENCE',
    description: 'Every single line and paragraph recited word-for-word without cuts.',
    popularityCount: 3100
  }
];
