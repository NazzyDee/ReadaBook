export interface EyeContactConfig {
  isEnabled: boolean;
  intensityPct: number;
  blinkSmoothing: boolean;
  readingNotesWindowAnchor: 'TOP_CENTER' | 'MANUSCRIPT_DESK' | 'FLOATING_RIGHT';
  gazeDriftThreshold: number;
}

export const DEFAULT_EYE_CONTACT_CONFIG: EyeContactConfig = {
  isEnabled: true,
  intensityPct: 85,
  blinkSmoothing: true,
  readingNotesWindowAnchor: 'MANUSCRIPT_DESK',
  gazeDriftThreshold: 15
};
