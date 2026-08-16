export interface PinnedAnnouncement {
  id: string;
  author: string;
  authorRole: 'Broadcaster' | 'Moderator' | 'Verified Author';
  text: string;
  themeColor: 'gold' | 'blue' | 'green' | 'purple';
  pinnedAt: string;
  durationMins: number; // 0 = persistent
  isPinned: boolean;
}

export const DEFAULT_PINNED_ANNOUNCEMENT: PinnedAnnouncement = {
  id: 'pin_01',
  author: 'LillyReadsBooks',
  authorRole: 'Broadcaster',
  text: '📖 SPRINT IN PROGRESS: Reading Chapter 5 (Pages 240-275) until 4:30 PM! Type your favorite quote in chat for a shoutout ✨',
  themeColor: 'gold',
  pinnedAt: '4:00 PM',
  durationMins: 30,
  isPinned: true
};
