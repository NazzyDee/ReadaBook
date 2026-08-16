export interface GenrePacingTarget {
  genre: string;
  idealWpmRange: string;
  targetWpm: number;
  targetBpm: number;
  description: string;
}

export const GENRE_PACING_TARGETS: GenrePacingTarget[] = [
  {
    genre: 'Epic High Fantasy',
    idealWpmRange: '145 - 160 WPM',
    targetWpm: 155,
    targetBpm: 60,
    description: 'Measured, world-building cadence allowing complex names and geography to resonate.'
  },
  {
    genre: 'Thriller / Action',
    idealWpmRange: '170 - 190 WPM',
    targetWpm: 180,
    targetBpm: 72,
    description: 'Brisk, pulse-pounding tempo creating suspense and immediate urgency.'
  },
  {
    genre: "Children's Bedtime & YA",
    idealWpmRange: '115 - 135 WPM',
    targetWpm: 125,
    targetBpm: 48,
    description: 'Calm, soothing, warm rhythm with expressive pauses and character voices.'
  },
  {
    genre: 'Gothic Horror / Cosmic',
    idealWpmRange: '130 - 145 WPM',
    targetWpm: 138,
    targetBpm: 52,
    description: 'Deliberate, eerie, atmospheric pacing building lingering dread.'
  }
];
