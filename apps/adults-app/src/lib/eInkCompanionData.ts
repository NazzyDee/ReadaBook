export interface EInkDeviceProfile {
  deviceModel: 'KINDLE_PAPERWHITE' | 'KINDLE_SCRIBE' | 'KOBO_CLARA' | 'BOOX_PALMA';
  refreshRateMode: 'A2_FAST_REFRESH' | 'REGAL_HIGH_QUALITY' | 'NORMAL';
  contrastPct: number; // 0 to 100
  isBrowserCompanionSynced: boolean;
  activeEpubSyncTitle: string;
}

export const DEFAULT_EINK_PROFILE: EInkDeviceProfile = {
  deviceModel: 'KINDLE_PAPERWHITE',
  refreshRateMode: 'REGAL_HIGH_QUALITY',
  contrastPct: 90,
  isBrowserCompanionSynced: true,
  activeEpubSyncTitle: 'The Fellowship of the Ring (Book 2)'
};
