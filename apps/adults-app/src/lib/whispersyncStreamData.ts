export interface WhispersyncState {
  currentChapter: number;
  currentPage: number;
  currentParagraphIndex: number;
  totalBookPages: number;
  audioTimestampSeconds: number;
  syncedSentenceText: string;
  isAutoScrollEnabled: boolean;
  syncLatencyMs: number;
}

export const DEFAULT_WHISPERSYNC: WhispersyncState = {
  currentChapter: 14,
  currentPage: 218,
  currentParagraphIndex: 4,
  totalBookPages: 480,
  audioTimestampSeconds: 3420,
  syncedSentenceText: '"The gates of Minas Tirith had never fallen in all the ages of the world."',
  isAutoScrollEnabled: true,
  syncLatencyMs: 42
};
