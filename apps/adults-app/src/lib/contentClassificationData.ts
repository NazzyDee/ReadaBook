export interface ContentClassificationLabel {
  id: string;
  name: string;
  category: 'Violence' | 'Romance' | 'Horror' | 'Language' | 'General';
  description: string;
  is18Plus: boolean;
  icon: string;
  isSelected: boolean;
}

export const DEFAULT_CLASSIFICATION_LABELS: ContentClassificationLabel[] = [
  {
    id: 'ccl_grimdark',
    name: 'Grimdark Graphic Violence & Combat',
    category: 'Violence',
    description: 'Detailed descriptions of medieval warfare, sword fights, or severe fantasy battles.',
    is18Plus: true,
    icon: '⚔️',
    isSelected: true
  },
  {
    id: 'ccl_psych_horror',
    name: 'Psychological Horror & Dread',
    category: 'Horror',
    description: 'Lovecraftian eldritch horror, sanity degradation, and disturbing atmosphere.',
    is18Plus: false,
    icon: '👁️',
    isSelected: true
  },
  {
    id: 'ccl_dark_romance',
    name: 'Mature Romance & Spicy Themes (18+)',
    category: 'Romance',
    description: 'Explicit romantic scenes, dark romance tropes, and sensual encounters.',
    is18Plus: true,
    icon: '💋',
    isSelected: false
  },
  {
    id: 'ccl_profanity',
    name: 'Strong or Coarse Language',
    category: 'Language',
    description: 'Frequent or intense profanity used in character dialogue.',
    is18Plus: false,
    icon: '🤬',
    isSelected: false
  },
  {
    id: 'ccl_family_friendly',
    name: 'All-Ages & Family Friendly',
    category: 'General',
    description: 'Suitable for general audiences, young adult readers, and book clubs.',
    is18Plus: false,
    icon: '🌱',
    isSelected: false
  }
];
