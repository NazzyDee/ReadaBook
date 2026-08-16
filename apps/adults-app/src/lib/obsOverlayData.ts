export interface OverlayWidgetConfig {
  theme: 'parchment' | 'cyberpunk' | 'dark_fantasy' | 'minimalist';
  showBookProgress: boolean;
  showAlertBox: boolean;
  showTransparentChat: boolean;
  showGoalBar: boolean;
  alertVolume: number; // 0 to 100
  fontFamily: string;
}

export const DEFAULT_OVERLAY_CONFIG: OverlayWidgetConfig = {
  theme: 'parchment',
  showBookProgress: true,
  showAlertBox: true,
  showTransparentChat: true,
  showGoalBar: true,
  alertVolume: 80,
  fontFamily: 'Cinzel Decorative, Georgia, serif'
};
