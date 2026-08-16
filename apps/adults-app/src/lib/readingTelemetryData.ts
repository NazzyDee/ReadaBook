export interface ReadingTelemetryStats {
  currentWpm: number;
  averageWpm: number;
  totalPagesRead: number;
  totalWordsRead: number;
  sessionDurationMins: number;
  readingPacing: 'Lyrical Slow' | 'Engaged Standard' | 'Sprint Velocity';
  rareVocabFound: {
    word: string;
    definition: string;
    timestamp: string;
  }[];
}

export const MOCK_READING_TELEMETRY: ReadingTelemetryStats = {
  currentWpm: 235,
  averageWpm: 218,
  totalPagesRead: 34,
  totalWordsRead: 10880,
  sessionDurationMins: 52,
  readingPacing: 'Engaged Standard',
  rareVocabFound: [
    {
      word: 'Eldritch',
      definition: 'Sinister, ghostly, or unearthly in appearance or sound.',
      timestamp: '4:12 PM'
    },
    {
      word: 'Petrichor',
      definition: 'A pleasant smell that frequently accompanies the first rain after a long period of warm, dry weather.',
      timestamp: '4:28 PM'
    },
    {
      word: 'Labyrinthine',
      definition: 'Irregular, twisting, or complicated like a maze.',
      timestamp: '4:45 PM'
    }
  ]
};
