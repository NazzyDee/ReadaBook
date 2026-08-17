export interface ScreenReaderNarrationSettings {
  speechRate: number; // 0.75x to 2.5x
  pitch: number; // 0.5 to 1.5
  volumePct: number; // 0 to 100
  announceChatMentions: boolean;
  announceStreamStatusChanges: boolean;
  describeVisualEmotes: boolean;
  describeScreenLayoutMode: boolean;
}

export const DEFAULT_SCREEN_READER_SETTINGS: ScreenReaderNarrationSettings = {
  speechRate: 1.0,
  pitch: 1.0,
  volumePct: 80,
  announceChatMentions: true,
  announceStreamStatusChanges: true,
  describeVisualEmotes: true,
  describeScreenLayoutMode: false
};
