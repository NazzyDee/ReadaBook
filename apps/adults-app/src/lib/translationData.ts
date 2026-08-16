export interface LiveSubtitleLine {
  id: string;
  originalEnglish: string;
  timestamp: string;
  translations: {
    es: string; // Spanish
    fr: string; // French
    de: string; // German
    ja: string; // Japanese
    zh: string; // Mandarin
  };
}

export const SAMPLE_SUBTITLES: LiveSubtitleLine[] = [
  {
    id: 'sub-1',
    timestamp: '00:14:02',
    originalEnglish: 'The world is changed. I feel it in the water. I feel it in the earth. I smell it in the air.',
    translations: {
      es: 'El mundo ha cambiado. Lo siento en el agua. Lo siento en la tierra. Lo huelo en el aire.',
      fr: 'Le monde a changé. Je le sens dans l\'eau. Je le ressens dans la terre. Je le sens dans l\'air.',
      de: 'Die Welt ist im Wandel. Ich spüre es im Wasser. Ich spüre es in der Erde. Ich rieche es in der Luft.',
      ja: '世界は変わった。水の中にそれを感じる。大地にそれを感じる。空気の中にそれを嗅ぎ取る。',
      zh: '世界变了。我从水中感觉到它。我从泥土中感觉到它。我从空气中闻到它。'
    }
  },
  {
    id: 'sub-2',
    timestamp: '00:14:18',
    originalEnglish: 'Much that once was is lost, for none now live who remember it.',
    translations: {
      es: 'Mucho de lo que una vez fue se ha perdido, pues nadie vive ahora que lo recuerde.',
      fr: 'Beaucoup de ce qui fut jadis est perdu, car nul ne vit aujourd\'hui pour s\'en souvenir.',
      de: 'Vieles, was einst war, ist verloren, denn niemand lebt mehr, der sich daran erinnert.',
      ja: 'かつてあった多くのものが失われた。それを覚えている者はもう誰も生きていないのだから。',
      zh: '昔日许多事物已荡然无存，因为如今活着的人再无谁能忆起。'
    }
  },
  {
    id: 'sub-3',
    timestamp: '00:14:35',
    originalEnglish: 'It began with the forging of the Great Rings.',
    translations: {
      es: 'Comenzó con la forja de los Grandes Anillos.',
      fr: 'Tout commença par la forge des Grands Anneaux.',
      de: 'Es begann mit dem Schmieden der Großen Ringe.',
      ja: 'それは大いなる指輪たちの鍛造から始まった。',
      zh: '这一切始于伟大魔戒的铸造。'
    }
  }
];

export const SUPPORTED_LANGUAGES = [
  { code: 'es', label: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr', label: 'French (Français)', flag: '🇫🇷' },
  { code: 'de', label: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'ja', label: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'zh', label: 'Mandarin (中文)', flag: '🇨🇳' }
] as const;

export type SupportedLangCode = typeof SUPPORTED_LANGUAGES[number]['code'];
