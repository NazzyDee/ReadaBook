export interface DubbedLanguageTrack {
  id: string;
  languageCode: string;
  languageName: string;
  flagEmoji: string;
  activeListenersCount: number;
  aiVoiceModel: 'NEURAL_HD' | 'EXPRESSIVE_STUDIO';
  isEnabled: boolean;
  sampleSubtitle: string;
}

export const DEFAULT_DUBBING_TRACKS: DubbedLanguageTrack[] = [
  {
    id: 'dub_es',
    languageCode: 'es-ES',
    languageName: 'Spanish (Castilian & LatAm)',
    flagEmoji: '🇪🇸',
    activeListenersCount: 342,
    aiVoiceModel: 'EXPRESSIVE_STUDIO',
    isEnabled: true,
    sampleSubtitle: '"No me hables de juramentos olvidados mientras las brasas sigan brillando."'
  },
  {
    id: 'dub_ja',
    languageCode: 'ja-JP',
    languageName: 'Japanese (Nihongo)',
    flagEmoji: '🇯🇵',
    activeListenersCount: 512,
    aiVoiceModel: 'EXPRESSIVE_STUDIO',
    isEnabled: true,
    sampleSubtitle: '「西の空に燃え殻がまだ輝いている間に、忘れ去られた誓いのことを話すな。」'
  },
  {
    id: 'dub_fr',
    languageCode: 'fr-FR',
    languageName: 'French (Français)',
    flagEmoji: '🇫🇷',
    activeListenersCount: 180,
    aiVoiceModel: 'NEURAL_HD',
    isEnabled: false,
    sampleSubtitle: '"Ne me parlez pas de serments oubliés tant que les braises brillent encore."'
  },
  {
    id: 'dub_de',
    languageCode: 'de-DE',
    languageName: 'German (Deutsch)',
    flagEmoji: '🇩🇪',
    activeListenersCount: 145,
    aiVoiceModel: 'NEURAL_HD',
    isEnabled: false,
    sampleSubtitle: '"Sprich nicht von vergessenen Schwüren, solange die Glut noch am westlichen Himmel leuchtet."'
  }
];
