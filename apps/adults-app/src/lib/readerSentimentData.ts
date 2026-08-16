export interface SentimentDataPoint {
  chapterMinute: number;
  emotion: 'TENSION' | 'JOY' | 'SORROW' | 'MYSTERY' | 'EPIC';
  intensity: number; // 0 - 100
  chatEmojiSpike: string;
  keyPlotEvent: string;
}

export const CHAPTER_SENTIMENT_TIMELINE: SentimentDataPoint[] = [
  {
    chapterMinute: 5,
    emotion: 'MYSTERY',
    intensity: 45,
    chatEmojiSpike: '🕵️‍♂️ (120 reactions)',
    keyPlotEvent: 'Frodo notices dark cloaked stranger watching from the tavern corner.'
  },
  {
    chapterMinute: 12,
    emotion: 'TENSION',
    intensity: 75,
    chatEmojiSpike: '😱 (340 reactions)',
    keyPlotEvent: 'Frodo accidentally puts on the One Ring in the middle of the common room!'
  },
  {
    chapterMinute: 18,
    emotion: 'EPIC',
    intensity: 90,
    chatEmojiSpike: '🔥 (580 reactions)',
    keyPlotEvent: 'Strider reveals himself as Aragorn and draws the broken blade of Elendil.'
  },
  {
    chapterMinute: 24,
    emotion: 'JOY',
    intensity: 60,
    chatEmojiSpike: '🍺 (210 reactions)',
    keyPlotEvent: 'Pippin and Merry share warm cider and pledge their loyalty.'
  }
];
