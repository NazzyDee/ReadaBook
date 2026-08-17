export interface AdaptiveReadingProfile {
  fontFamily: 'OPEN_DYSLEXIC' | 'ATKINSON_HYPERLEGIBLE' | 'LEXEND_DECA' | 'STANDARD_SANS';
  colorTheme: 'CREAM_WARM_SEPIA' | 'SOLARIZED_DARK' | 'HIGH_CONTRAST_YELLOW_BLACK' | 'TINTED_CYAN';
  fontSizePx: number; // 14 to 32
  letterSpacingEm: number; // 0.05 to 0.35
  lineHeightRatio: number; // 1.4 to 2.4
  bionicReadingBoldWeight: boolean; // First few characters of each word bolded
  readingRulerLineHighlight: boolean; // Follow mouse / current sentence with yellow bar
}

export const DEFAULT_ADAPTIVE_PROFILE: AdaptiveReadingProfile = {
  fontFamily: 'OPEN_DYSLEXIC',
  colorTheme: 'CREAM_WARM_SEPIA',
  fontSizePx: 20,
  letterSpacingEm: 0.15,
  lineHeightRatio: 1.8,
  bionicReadingBoldWeight: true,
  readingRulerLineHighlight: true
};
