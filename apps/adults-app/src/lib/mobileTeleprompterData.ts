export interface TeleprompterConfig {
  pairedDeviceId: string;
  pairedDeviceName: string;
  batteryLevel: number;
  scrollSpeedWpm: number;
  fontSizePt: number;
  isVoiceTrackingEnabled: boolean;
  syncToken: string;
}

export const DEFAULT_TELEPROMPTER_CONFIG: TeleprompterConfig = {
  pairedDeviceId: 'ipad_pro_129',
  pairedDeviceName: 'iPad Pro (Narrator Studio Stand)',
  batteryLevel: 94,
  scrollSpeedWpm: 155,
  fontSizePt: 28,
  isVoiceTrackingEnabled: true,
  syncToken: 'RAB-TELE-8842-PROMPT'
};
