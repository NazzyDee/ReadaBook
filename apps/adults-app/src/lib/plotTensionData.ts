export interface TensionDataPoint {
  timestampMinute: number;
  tensionLevelPct: number; // 0 to 100
  dominantEmotion: 'DREAD' | 'HOPE' | 'SUSPENSE' | 'TRIUMPH' | 'COMEDY';
  sceneExcerpt: string;
}

export interface PlotTensionTimeline {
  currentTensionPct: number;
  averageTensionPct: number;
  peakTensionMoment: string;
  points: TensionDataPoint[];
}

export const DEFAULT_PLOT_TENSION: PlotTensionTimeline = {
  currentTensionPct: 88,
  averageTensionPct: 54,
  peakTensionMoment: 'The Breaking of the Fellowship at Amon Hen',
  points: [
    { timestampMinute: 10, tensionLevelPct: 25, dominantEmotion: 'HOPE', sceneExcerpt: 'Resting in the tranquil glades of Lothlórien.' },
    { timestampMinute: 30, tensionLevelPct: 45, dominantEmotion: 'SUSPENSE', sceneExcerpt: 'Boats gliding past the colossal statues of the Argonath.' },
    { timestampMinute: 60, tensionLevelPct: 70, dominantEmotion: 'DREAD', sceneExcerpt: 'Boromir cornered by the Uruk-hai horn calls.' },
    { timestampMinute: 90, tensionLevelPct: 88, dominantEmotion: 'SUSPENSE', sceneExcerpt: 'Frodo and Sam slipping away toward the Dead Marshes.' }
  ]
};
