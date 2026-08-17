export interface MobileCompanionDevice {
  deviceId: string;
  deviceName: string;
  deviceType: 'IOS_IPHONE' | 'ANDROID_PIXEL' | 'IPAD_PRO';
  batteryLevelPct: number;
  isStreamDeckRemoteConnected: boolean;
  pairedAt: string;
}

export const DEFAULT_COMPANION_DEVICES: MobileCompanionDevice[] = [
  {
    deviceId: 'dev_iphone_15',
    deviceName: "Nazzy's iPhone 15 Pro (Pocket Stream Deck)",
    deviceType: 'IOS_IPHONE',
    batteryLevelPct: 88,
    isStreamDeckRemoteConnected: true,
    pairedAt: '10 minutes ago'
  },
  {
    deviceId: 'dev_pixel_tablet',
    deviceName: "Studio Pixel Tablet (Chat & Foley Remote)",
    deviceType: 'ANDROID_PIXEL',
    batteryLevelPct: 94,
    isStreamDeckRemoteConnected: true,
    pairedAt: '1 hour ago'
  }
];
