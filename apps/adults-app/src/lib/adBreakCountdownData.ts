export interface AdBreakConfig {
  durationSeconds: number; // 30, 60, 90, 180
  label: string;
  payoutSparksEstimated: number;
  viewerSparksReward: number;
  breakType: 'TEA_INTERMISSION' | 'HYDRATION_SNOOZE' | 'CHAPTER_RECAP_BREAK';
}

export const AVAILABLE_AD_BREAKS: AdBreakConfig[] = [
  {
    durationSeconds: 30,
    label: '30s Quick Tea Sip',
    payoutSparksEstimated: 120,
    viewerSparksReward: 15,
    breakType: 'TEA_INTERMISSION'
  },
  {
    durationSeconds: 60,
    label: '60s Vocal Rest & Hydration',
    payoutSparksEstimated: 250,
    viewerSparksReward: 30,
    breakType: 'HYDRATION_SNOOZE'
  },
  {
    durationSeconds: 90,
    label: '90s Mid-Chapter Commercial Intermission',
    payoutSparksEstimated: 400,
    viewerSparksReward: 50,
    breakType: 'TEA_INTERMISSION'
  },
  {
    durationSeconds: 180,
    label: '180s Grand Act Intermission (Cozy Hearth)',
    payoutSparksEstimated: 850,
    viewerSparksReward: 100,
    breakType: 'CHAPTER_RECAP_BREAK'
  }
];
