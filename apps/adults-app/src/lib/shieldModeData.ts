export interface ShieldModeSettings {
  isShieldActive: boolean;
  chatMode: 'normal' | 'sub_only' | 'verified_only' | 'emote_only';
  blockIncomingRaids: boolean;
  aggressiveSpoilerCensor: boolean;
  massPurgeTriggered: boolean;
  blockedPhrasesCount: number;
}

export const DEFAULT_SHIELD_SETTINGS: ShieldModeSettings = {
  isShieldActive: false,
  chatMode: 'sub_only',
  blockIncomingRaids: true,
  aggressiveSpoilerCensor: true,
  massPurgeTriggered: false,
  blockedPhrasesCount: 42
};
