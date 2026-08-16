export interface ManuscriptZoomConfig {
  zoomFactor: number; // 1.5x to 8.0x
  loupeShape: 'CIRCULAR_BRASS_LENS' | 'RECTANGULAR_CALLIGRAPHY_FRAME' | 'FULL_SCREEN_SPLIT';
  colorFilter: 'NATURAL' | 'UV_BLACKLIGHT_WATERMARK' | 'HIGH_CONTRAST_INK' | 'ANTIQUE_PARCHMENT';
  illuminationGlowPct: number;
}

export const DEFAULT_MANUSCRIPT_ZOOM: ManuscriptZoomConfig = {
  zoomFactor: 3.5,
  loupeShape: 'CIRCULAR_BRASS_LENS',
  colorFilter: 'ANTIQUE_PARCHMENT',
  illuminationGlowPct: 75
};
