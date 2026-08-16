export interface VocalHealthMetrics {
  currentPitchHz: number;
  pitchJitterPct: number;
  vocalStrainScorePct: number; // 0 to 100
  continuousSpeakingMinutes: number;
  recommendedHydrationMl: number;
  vocalStatus: 'OPTIMAL' | 'SLIGHT_STRAIN' | 'REST_RECOMMENDED' | 'CRITICAL';
}

export const DEFAULT_VOCAL_HEALTH: VocalHealthMetrics = {
  currentPitchHz: 128,
  pitchJitterPct: 1.4,
  vocalStrainScorePct: 28,
  continuousSpeakingMinutes: 84,
  recommendedHydrationMl: 450,
  vocalStatus: 'OPTIMAL'
};
