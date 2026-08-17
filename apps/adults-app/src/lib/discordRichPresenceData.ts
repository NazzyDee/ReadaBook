export interface RichPresenceStatus {
  service: 'DISCORD_RPC' | 'MATRIX_SPACE' | 'TELEGRAM_CHANNEL';
  isConnected: boolean;
  activeStatusText: string;
  activityDetails: string;
  largeImageKey: string;
  smallImageKey: string;
  showReadingProgressPct: boolean;
}

export const DEFAULT_RICH_PRESENCE: RichPresenceStatus = {
  service: 'DISCORD_RPC',
  isConnected: true,
  activeStatusText: 'Reading The Lord of the Rings (Book 2)',
  activityDetails: 'Live with NazzyDee & 342 viewers',
  largeImageKey: 'lotr_fellowship_cover',
  smallImageKey: 'readabook_live_badge',
  showReadingProgressPct: true
};
