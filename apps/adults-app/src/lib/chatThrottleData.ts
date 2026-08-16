export interface ChatThrottleSettings {
  isSubOnly: boolean;
  isFollowerOnly: boolean;
  followerDurationMins: number; // 0 (any), 10, 60, 1440 (1 day), 43200 (1 mo)
  isSlowMode: boolean;
  slowModeSeconds: number; // 3, 10, 30, 60, 120
  isEmoteOnly: boolean;
  isFirstTimeChatterHighlight: boolean;
  isWhisperShieldEnabled: boolean;
}

export const DEFAULT_CHAT_THROTTLE_SETTINGS: ChatThrottleSettings = {
  isSubOnly: false,
  isFollowerOnly: true,
  followerDurationMins: 10,
  isSlowMode: true,
  slowModeSeconds: 10,
  isEmoteOnly: false,
  isFirstTimeChatterHighlight: true,
  isWhisperShieldEnabled: true
};
